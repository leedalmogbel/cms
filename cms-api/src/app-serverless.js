require('module').Module._initPaths();
const config = require('config');
const AWS = require('aws-sdk');
const awilix = require('awilix');
const { brew } = require('./infra/core/core');

const { asClass } = awilix;
const httpClient = require('./infra/http-request');


module.exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log({
    resource: event.resource,
    path: event.path,
    httpMethod: event.httpMethod,
    headers: {
      Accept: event.headers.Accept,
      'content-type': event.headers['content-type'],
    },
    body: event.body,
  });

  const setupDBSecrets = async () => {
    const client = new AWS.SecretsManager({
      region: process.env.REGION,
    });

    const secretValue = await client.getSecretValue({ SecretId: process.env.SECRET_MANAGER_DB })
      .promise();

    const {
      username,
      password,
      host,
    } = JSON.parse(secretValue.SecretString);

    process.env.DB_USERNAME = (typeof username !== 'undefined') ? username : process.env.DB_USERNAME;
    process.env.DB_PASSWORD = (typeof password !== 'undefined') ? password : process.env.DB_PASSWORD;
    process.env.DB_HOST = (typeof host !== 'undefined') ? host : process.env.DB_HOST;
  };

  const setupAppSecrets = async () => {
    const client = new AWS.SecretsManager({
      region: process.env.REGION,
    });

    const secretValue = await client.getSecretValue({
      SecretId: process.env.SECRET_MANAGER_APP,
    }).promise();

    const {
      BUCKET_NAME,
    } = JSON.parse(secretValue.SecretString);

    process.env.BUCKET_NAME = (typeof BUCKET_NAME !== 'undefined') ? BUCKET_NAME : process.env.BUCKET_NAME;
  };

  brew(config, async (brewed) => {
    setupDBSecrets();
    setupAppSecrets();
    try {
      if (typeof brewed.getServerless === 'function') {
        brewed.container.register({
          httpClient: asClass(httpClient).singleton(),
        });

        const app = await brewed.getServerless();
        const res = await app(event, context);

        res.headers = {
          ...res.headers,
          'strict-transport-security': 'max-age=63072000; includeSubdomains; preload',
          'cache-control': 'no-store',
          pragma: 'no-cache',
        };

        callback(null, res);
      }

      if (typeof brewed.container === 'undefined') {
        throw brewed;
      }
    } catch (err) {
      console.error({ err });

      const result = {
        statusCode: 500,
        headers: {
          vary: 'X-HTTP-Method-Override, Accept-Encoding',
          'access-control-allow-origin': '*',
          'content-type': 'application/json; charset=utf-8',
          'content-length': '123',
          etag: 'W/"7b-4fX2oxJX//eq+2dT/O1xHT9on+Q"',
        },
        isBase64Encoded: false,
        body: JSON.stringify({
          message: err.message,
        }),
      };

      callback(null, result);
    }
  });
};
