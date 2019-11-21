const { Operation } = require('@brewery/core');
const Socket = require('src/domain/Socket');

class RegisterSocket extends Operation {
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
      const { type, userId } = event.queryStringParameters;

      const payload = new Socket({
        userId,
        connectionId,
        type,
      });

      await this.SocketRepository.add(payload);

      return {
        statusCode: 200,
        headers,
        body: 'Socket successfully registered.',
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: 'Unable to register socket.',
      };
    }
  }
}
module.exports = RegisterSocket;
