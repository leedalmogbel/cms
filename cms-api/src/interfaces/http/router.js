const { Router, static } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');
const path = require('path');
const openApiDoc = require('./openApi.json');
const authMiddleware = require('./middlewares/authMiddleware');

module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler, openApiMiddleware }) => {
  const router = Router();
  router.use(containerMiddleware);

  /* istanbul ignore if */
  if(config.env === 'development') {
    router.use(statusMonitor());
  }

  /* istanbul ignore if */
  if(config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use('/docs', openApiMiddleware(openApiDoc))
    .use(authMiddleware);

  /*
   * Add your API routes here
   *
   * You can use the `controllers` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   * Avoid hardcoding in this file as much. Deleting comments in this file
   * may cause errors on scaffoldings
   */
  apiRouter.use('/auth', controller('controllers/AuthController.js'));
  apiRouter.use('/users', controller('controllers/UsersController.js'));
  apiRouter.use('/posts', controller('controllers/PostsController.js'));
  apiRouter.use('/advisories', controller('controllers/AdvisoriesController.js'));
  apiRouter.use('/notifications', controller('controllers/NotificationsController.js'));
  apiRouter.use('/agendas', controller('controllers/AgendasController.js'));
  apiRouter.use('/tags', controller('controllers/TagsController.js'));
  apiRouter.use('/categories', controller('controllers/CategoriesController.js'));
  apiRouter.use('/recyclebin', controller('controllers/RecycleBinController.js'));
  apiRouter.use('/posttags', controller('controllers/PostTagsController.js'));
  apiRouter.use('/postadvisory', controller('controllers/PostAdvisoriesController.js'));
  apiRouter.use('/templates', controller('controllers/TemplatesController.js'));
  
  /* apiRoutes END */

  router.use('/api', apiRouter);
  router.use('/', static(path.join(__dirname, './public')));
  router.use(errorHandler);

  return router;
};
