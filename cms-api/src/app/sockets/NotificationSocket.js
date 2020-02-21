const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

class NotificationSocket extends Operation {
  constructor({ SocketRepository }) {
    super();

    this.SocketRepository = SocketRepository;
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
      const { data } = JSON.parse(event.body);

      // get all sockets connected with type notification
      const sockets = await this.SocketRepository.getAll();

      await Promise.all(
        sockets.map(async (socket) => {
          // skip same connectionId to prevent sending to self
          if (socket.connectionId === connectionId) {
            return;
          }

          await this.notify(socket.connectionId, data);
        }),
      );

      return {
        statusCode: 200,
        headers,
        body: 'Default socket response.',
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: 'Default socket response error.',
      };
    }
  }

  async notify(connectionId, data) {
    try {
      return await this.socketConnector.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      }).promise();
    } catch (err) {
      console.log('Websocket error: ', err);

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

  async notifyUser(userId, data) {
    const socket = await this.SocketRepository.model.findOne({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!socket) return;
    await this.notify(socket.connectionId, data);
  }
}
module.exports = NotificationSocket;
