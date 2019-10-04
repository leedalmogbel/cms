require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const config = require('config');

module.exports.handler = (event, context, callback) => {

  brew(config, async brewed => {
    try {
      if(typeof brewed.getServerless === 'function'){
        const app = await brewed.getServerless();
        const res = await app(event, context);
        callback(null, res);
      }
      throw brewed;
    } catch (err) {
      callback(null, {
        statusCode: 500,
        headers: { vary: 'X-HTTP-Method-Override, Accept-Encoding',
          'access-control-allow-origin': '*',
          'content-type': 'application/json; charset=utf-8',
          'content-length': '123',
          etag: 'W/"7b-4fX2oxJX//eq+2dT/O1xHT9on+Q"' },
        isBase64Encoded: false,
        body:JSON.stringify({
          message: err.message
        })
      });
    }
  });
  
};
