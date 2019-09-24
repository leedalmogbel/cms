require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const config = require('config');

brew(config, brewed => {

  const app = brewed.getServer();
  app.start().catch(error => {
    app.logger.error(error.stack);
    process.exit();
  });
  
});
