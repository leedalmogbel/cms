const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

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
      const sockets = await this.SocketRepository.getAll({
        where: {
          type: 'notification',
        },
      });

      sockets.map(async (socket) => {
        // skip same connectionId to prevent sending to self
        if (socket.connectionId === connectionId) {
          return;
        }

        await this.notify(socket.connectionId, data);
      });

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
module.exports = NotificationSocket;
