require('module').Module._initPaths();
const awilix = require('awilix');
const config = require('config');
const { brew } = require('../src/infra/core/core');
const httpClient = require('./infra/http-request');

const { asClass } = awilix;

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    brewed.container.register({
      httpClient: asClass(httpClient).singleton(),
    });

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

module.exports.auth = async (event, context) => {
  console.log('test 123123');
  const Container = await getContainer();
  return Container.resolve('AuthSocket').execute(event, context);
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

module.exports.kickLockedPostConfirm = async (event, context, callback) => {
  const Container = await getContainer();
  const res = await Container.resolve('LockPostSocket').kickConfirm(event);
  callback(null, res);
};

module.exports.unlockPost = async (event, context, callback) => {
  const Container = await getContainer();
  const res = await Container.resolve('LockPostSocket').unlock(event);
  callback(null, res);
};
