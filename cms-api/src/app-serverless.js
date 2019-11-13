require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const config = require('config');
const awilix = require('awilix');

const { asClass } = awilix;
const httpClient = require('./infra/http-request');


module.exports.handler = (event, context, callback) => {
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

  brew(config, async (brewed) => {
    try {
      if (typeof brewed.getServerless === 'function') {
        brewed.container.register({
          httpClient: asClass(httpClient).singleton(),
        });

        const app = await brewed.getServerless();
        const res = await app(event, context);
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
