const Socket = require('src/domain/Socket');
const { Operation } = require('../../infra/core/core');

class RegisterSocket extends Operation {
  constructor({ SocketRepository, UserRepository }) {
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
      const { userId } = event.queryStringParameters;

      console.log('Websocket connect:', connectionId);

      // remove any existing socket by userId
      const exists = await this.SocketRepository.getByUserId(userId);
      if (exists) {
        await this.SocketRepository.model.destroy({
          where: {
            userId,
          },
        });
      }

      const payload = new Socket({
        userId,
        connectionId,
      });

      await this.SocketRepository.add(payload);

      return {
        statusCode: 200,
        headers,
        body: 'Socket successfully registered.',
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        headers,
        body: 'Unable to register socket.',
      };
    }
  }
}
module.exports = RegisterSocket;
