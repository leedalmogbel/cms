require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const config = require('config');

module.exports.handler = (event, context, callback) => {

  brew(config, async brewed => {
    const app = brewed.getServerless();
    try {
      const res = await app(event, context);
      callback(null, res);
    } catch (err) {
      callback(err);
    }
  });
  
};
