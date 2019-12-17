const Sequelize = require('sequelize');
const { Operation } = require('../../infra/core/core');

const { Op } = Sequelize;

class RemoveSocket extends Operation {
  constructor({ SocketRepository, PostRepository, LockPostSocket }) {
    super();
    this.SocketRepository = SocketRepository;
    this.PostRepository = PostRepository;
    this.LockPostSocket = LockPostSocket;
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

      // unlock post if exists
      // const post = await this.PostRepository
      //   .model
      //   .findOne({
      //     where: {
      //       isLocked: true,
      //       lockUser: {
      //         '"connectionId"': {
      //           [Op.eq]: connectionId,
      //         },
      //       },
      //     },
      //   });

      // console.log(post.toJSON());

      return {
        statusCode: 200,
        headers,
        body: 'Socket successfully terminated.',
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: 'Unable to terminate socket.',
      };
    }
  }
}
module.exports = RemoveSocket;
