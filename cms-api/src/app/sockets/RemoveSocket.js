const { Operation } = require('../../infra/core/core');

class RemoveSocket extends Operation {
  constructor({ SocketRepository }) {
    super();
    this.SocketRepository = SocketRepository;
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
