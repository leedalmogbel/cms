const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

class LockPostSocket extends Operation {
  constructor({ SocketRepository }) {
    super();

    this.SocketRepository = SocketRepository;
    this.socketConnector = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.WEBSOCKET_API_ENDPOINT,
    });
  }

  async lock(event) {
    // const { connectionId } = event.requestContext;
    // const { data } = JSON.parse(event.body);

    console.log('lock post');
  }

  async kick(event) {
    console.log('kick locked post');
  }
}
module.exports = LockPostSocket;
