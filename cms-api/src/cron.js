require('module').Module._initPaths();
const { brew } = require('../../infra/core/core');
const awilix = require('awilix');
const config = require('config');
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

module.exports.scheduled = async (event, context, callback) => {
  const container = await getContainer();

  await container.resolve('ScheduledPost')
    .execute();

  return {
    message: 'success',
  };
};
