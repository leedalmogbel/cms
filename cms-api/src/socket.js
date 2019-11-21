require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const config = require('config');

const success = {
  statusCode: 200,
};

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    resolve(brewed.container);
  });
});

module.exports.connect = async (event, context) => {
  const Container = await getContainer();
  return Container.resolve('RegisterSocket').execute(event);
};

module.exports.disconnect = async (event, context) => {
  const Container = await getContainer();
  return Container.resolve('RemoveSocket').execute(event);
};

module.exports.default = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('DefaultSocket').execute(event);
};

module.exports.notify = async (event, context, callback) => {
  console.log(event);
  return success;
};
