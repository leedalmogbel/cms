const Sequelize = require('sequelize');
const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

const { Op } = Sequelize;

class RemoveSocket extends Operation {
  constructor({ SocketRepository, PostRepository, LockPostSocket }) {
    super();
    this.SocketRepository = SocketRepository;
    this.PostRepository = PostRepository;
    this.LockPostSocket = LockPostSocket;

    this.socketConnector = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.WEBSOCKET_API_ENDPOINT,
    });
  }

  async execute(event) {
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    try {
      const { connectionId } = event.requestContext;

      await this.SocketRepository.model.destroy({
        where: {
          connectionId,
        },
      });

      // get locked post based on connectionId
      const post = await this.PostRepository
        .model
        .findOne({
          where: {
            isLocked: true,
            [Op.and]: Sequelize.literal(`lockUser->"$.connectionId"="${connectionId}"`),
          },
        });

      // unlock and broadcast to all sockets
      if (post) {
        await this.PostRepository.update(post.id, {
          isLocked: false,
          lockUser: null,
        });

        const sockets = await this.SocketRepository.getAll();

        await Promise.all(
          sockets.map(async (socket) => {
            await this.send(socket.connectionId, {
              type: 'BROADCAST_UNLOCK',
              message: '',
              meta: {
                id: post.id,
                postId: post.postId,
              },
            });
          }),
        );
      }

      return {
        statusCode: 200,
        headers,
        body: 'Socket successfully terminated.',
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        headers,
        body: 'Unable to terminate socket.',
      };
    }
  }

  async send(connectionId, data) {
    try {
      return await this.socketConnector.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      }).promise();
    } catch (err) {
      // remove stale connection
      if (err.statusCode === 410) {
        await this.SocketRepository.model.destroy({
          where: {
            connectionId,
          },
        });
      }
    }
  }
}
module.exports = RemoveSocket;
