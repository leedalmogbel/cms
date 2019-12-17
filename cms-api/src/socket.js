require('module').Module._initPaths();
const config = require('config');
const { brew } = require('../src/infra/core/core');

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

module.exports.default = async (event, context) => {
  const Container = await getContainer();
  return Container.resolve('DefaultSocket').execute(event);
};

module.exports.notify = async (event, context) => {
  const Container = await getContainer();
  return Container.resolve('NotificationSocket').execute(event);
};

module.exports.lockPost = async (event, context, callback) => {
  const Container = await getContainer();
  const res = await Container.resolve('LockPostSocket').lock(event);
  callback(null, res);
};

module.exports.kickLockedPost = async (event, context, callback) => {
  const Container = await getContainer();
  const res = await Container.resolve('LockPostSocket').kick(event);
  callback(null, res);
};

module.exports.unlockPost = async (event, context, callback) => {
  const Container = await getContainer();
  const res = await Container.resolve('LockPostSocket').unlock(event);
  callback(null, res);
};
