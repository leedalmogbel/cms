const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

class ClearIdleLockedPost extends Operation {
  constructor({ SocketRepository, PostRepository }) {
    super();

    this.SocketRepository = SocketRepository;
    this.PostRepository = PostRepository;
    this.socketConnector = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.WEBSOCKET_API_ENDPOINT,
    });
  }

  async execute() {
    console.log('Cron Started');

    // get all locked post
    const posts = await this.PostRepository.getAll({
      where: {
        isLocked: true,
      },
    });

    console.log('Total locked posts', posts.length);

    await Promise.all(
      posts.map(async (post) => {
        if (!post.lockUser && !('connectionId' in post.lockUser)) return;

        const { connectionId } = post.lockUser;

        // ping socket to check for connectivity
        try {
          return await this.socketConnector.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              type: 'NOTIFY',
              message: 'socket connection idle test',
              meta: {},
            }),
          }).promise();
        } catch (err) {
          if (err.statusCode === 410) {
            // remove stale connection
            await this.SocketRepository.model.destroy({
              where: {
                connectionId,
              },
            });

            // unlock post
            post.update({
              isLocked: false,
              lockUser: null,
            }, {
              silent: true,
            });
          }
        }
      }),
    );

    console.log('Cron Ended');

    return 'success';
  }
}
module.exports = ClearIdleLockedPost;
