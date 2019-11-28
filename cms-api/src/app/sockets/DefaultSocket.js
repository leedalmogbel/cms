const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

class DefaultSocket extends Operation {
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

      await this.socketConnector.postToConnection({
        ConnectionId: connectionId,
        Data: 'Invalid request',
      }).promise();

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
}
module.exports = DefaultSocket;
