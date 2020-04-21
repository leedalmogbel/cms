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

  const client = new AWS.SecretsManager({
    region: process.env.REGION,
  });

  const setupDBSecrets = async () => {
    const secretValue = await client.getSecretValue({ SecretId: process.env.SECRET_MANAGER_DB })
      .promise();

    console.log({ db: secretValue, type: typeof secretValue });

    const {
      username,
      password,
      host,
    } = typeof secretValue === 'object' ? secretValue : JSON.parse(secretValue.SecretString);

    process.env.DB_USERNAME = (typeof username !== 'undefined') ? username : process.env.DB_USERNAME;
    process.env.DB_PASSWORD = (typeof password !== 'undefined') ? password : process.env.DB_PASSWORD;
    process.env.DB_HOST = (typeof host !== 'undefined') ? host : process.env.DB_HOST;
  };

  const setupAppSecrets = async () => {
    const secretValue = await client.getSecretValue({
      SecretId: process.env.SECRET_MANAGER_APP,
    }).promise();
    console.log({ app: secretValue, type: typeof secretValue });
    const {
      DB_NAME,
      COGNITO_POOL_ID,
      COGNITO_AUTHORIZER,
      AWS_ACCOUNT,
      REGION,
      PMS_POST_ENDPOINT,
      PMS_POST_RECALL_ENDPOINT,
      PMS_POST_TOKEN,
      WEBSOCKET_API_ENDPOINT,
      ROLE_ARN,
      SMART_TAGS_ENDPOINT,
      LOCATION_SERVICE,
      PLACE_KEY,
      PLACE_ENDPOINT,
      OSM_AUTOSUGGEST_ENDPOINT,
      BUCKET_NAME,
      FIREHOSE_POST_STREAM_ADD,
      FIREHOSE_POST_STREAM_UPDATE,
      API_DOMAIN_NAME,
      CERTIFICATE_NAME,
    } = JSON.parse(secretValue.SecretString);

    process.env.DB_NAME = (typeof DB_NAME !== 'undefined') ? DB_NAME : process.env.DB_NAME;
    process.env.COGNITO_POOL_ID = (typeof COGNITO_POOL_ID !== 'undefined') ? COGNITO_POOL_ID : process.env.COGNITO_POOL_ID;
    process.env.COGNITO_AUTHORIZER = (typeof COGNITO_AUTHORIZER !== 'undefined') ? COGNITO_AUTHORIZER : process.env.COGNITO_AUTHORIZER;
    process.env.AWS_ACCOUNT = (typeof AWS_ACCOUNT !== 'undefined') ? AWS_ACCOUNT : process.env.AWS_ACCOUNT;
    process.env.REGION = (typeof REGION !== 'undefined') ? REGION : process.env.REGION;
    process.env.PMS_POST_ENDPOINT = (typeof PMS_POST_ENDPOINT !== 'undefined') ? PMS_POST_ENDPOINT : process.env.PMS_POST_ENDPOINT;
    process.env.PMS_POST_RECALL_ENDPOINT = (typeof PMS_POST_RECALL_ENDPOINT !== 'undefined') ? PMS_POST_RECALL_ENDPOINT : process.env.PMS_POST_RECALL_ENDPOINT;
    process.env.PMS_POST_TOKEN = (typeof PMS_POST_TOKEN !== 'undefined') ? PMS_POST_TOKEN : process.env.PMS_POST_TOKEN;
    process.env.WEBSOCKET_API_ENDPOINT = (typeof WEBSOCKET_API_ENDPOINT !== 'undefined') ? WEBSOCKET_API_ENDPOINT : process.env.WEBSOCKET_API_ENDPOINT;
    process.env.ROLE_ARN = (typeof ROLE_ARN !== 'undefined') ? ROLE_ARN : process.env.ROLE_ARN;
    process.env.SMART_TAGS_ENDPOINT = (typeof SMART_TAGS_ENDPOINT !== 'undefined') ? SMART_TAGS_ENDPOINT : process.env.SMART_TAGS_ENDPOINT;
    process.env.LOCATION_SERVICE = (typeof LOCATION_SERVICE !== 'undefined') ? LOCATION_SERVICE : process.env.LOCATION_SERVICE;
    process.env.PLACE_KEY = (typeof PLACE_KEY !== 'undefined') ? PLACE_KEY : process.env.PLACE_KEY;
    process.env.PLACE_ENDPOINT = (typeof PLACE_ENDPOINT !== 'undefined') ? PLACE_ENDPOINT : process.env.PLACE_ENDPOINT;
    process.env.OSM_AUTOSUGGEST_ENDPOINT = (typeof OSM_AUTOSUGGEST_ENDPOINT !== 'undefined') ? OSM_AUTOSUGGEST_ENDPOINT : process.env.OSM_AUTOSUGGEST_ENDPOINT;
    process.env.BUCKET_NAME = (typeof BUCKET_NAME !== 'undefined') ? BUCKET_NAME : process.env.BUCKET_NAME;
    process.env.FIREHOSE_POST_STREAM_ADD = (typeof FIREHOSE_POST_STREAM_ADD !== 'undefined') ? FIREHOSE_POST_STREAM_ADD : process.env.FIREHOSE_POST_STREAM_ADD;
    process.env.FIREHOSE_POST_STREAM_UPDATE = (typeof FIREHOSE_POST_STREAM_UPDATE !== 'undefined') ? FIREHOSE_POST_STREAM_UPDATE : process.env.FIREHOSE_POST_STREAM_UPDATE;
    process.env.API_DOMAIN_NAME = (typeof API_DOMAIN_NAME !== 'undefined') ? API_DOMAIN_NAME : process.env.API_DOMAIN_NAME;
    process.env.CERTIFICATE_NAME = (typeof CERTIFICATE_NAME !== 'undefined') ? CERTIFICATE_NAME : process.env.CERTIFICATE_NAME;
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
