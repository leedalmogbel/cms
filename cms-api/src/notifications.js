require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const util = require('util');
const AWS = require('aws-sdk');

const success = {
  statusCode: 200,
};

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    brewed.container.register({
      httpClient: asClass(httpClient).singleton(),
    });

    resolve(brewed.container);
  });
});

module.exports.connectionHandler = async (event, context, callback) => {
  console.log('test 123123', context);
  return success;
};

module.exports.default = async (event, context, callback) => {
  console.log(event);
  return success;
};

module.exports.notify = async (event, context, callback) => {
  console.log(event);
  return success;
};

module.exports.updateClient = async (event, context, callback) => {
  console.log(event);
  const {
    id,
    protocol,
    domain,
    stage,
    message,
  } = JSON.parse(event.body);

  const sendMessageToClient = (url, connectionId, payload) => new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err);
          reject(err);
        }
        resolve(data);
      },
    );
  });

  const callbackUrlForAWS = util.format(util.format('%s://%s/%s', protocol, domain, stage)); // construct the needed url
  await sendMessageToClient(
    callbackUrlForAWS,
    id,
    message,
  );


  console.log(event);
  return success;
};


module.exports.defaultHandler = async (event, context) => ({
  statusCode: 200,
});
