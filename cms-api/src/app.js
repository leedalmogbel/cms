require('module').Module._initPaths();
const config = require('config');
const { brew } = require('../../infra/core/core');

brew(config, (brewed) => {
  const app = brewed.getServer();
  app.start().catch((error) => {
    app.logger.error(error.stack);
    process.exit();
  });
});
