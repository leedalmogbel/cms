require('module').Module._initPaths();
const awilix = require('awilix');
const config = require('config');
const { brew } = require('../src/infra/core/core');
const httpClient = require('../src/infra/http-request');

const { asClass } = awilix;

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    brewed.container.register({
      httpClient: asClass(httpClient).singleton(),
    });

    resolve(brewed.container);
  });
});

module.exports.scheduled = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('ScheduledPost').execute();
};

module.exports.lockedPost = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('ClearIdleLockedPost').execute();
};
