require('module').Module._initPaths();
const { brew } = require('@brewery/core');

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

module.exports.connect = async (event, context, callback) => {
  console.log(event);
  return success;
};

module.exports.disconnect = async (event, context, callback) => {
  console.log(event);
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
