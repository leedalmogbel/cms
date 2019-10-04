const { graphql } = require('graphql');
const Status = require('http-status');
const Schema = require('./schema');

module.exports = async (req, res, next) => {
  const { query, variables } = req.body;
  // TODO: DATALOADER FB
  const logger = req.container.resolve('logger');

  /**
  #jwt token from other implementation
  const handlers = req.container.resolve('handlers');
  const middlewares = req.container.resolve('middlewares');
  const jwt = req.container.resolve('jwt');
  const token = req.headers.pswebtoken;
  let user = null;
  if (typeof token === 'string') {
    const { data } = jwt.decode(token);
    user = await middlewares.authentication.authenticate(data);
    req.container.resolve('authorization').user = user;
  }
 */
  graphql(Schema, query, null, {
    // handlers, middlewares, user, httpInfo,
  }, variables).then((result) => {
    if (result.errors) {
      logger.error(result.errors);
      res.status(Status.INTERNAL_SERVER_ERROR).json({
        type: result.errors[0].name,
        message: result.errors[0].message,
        stack: result.errors[0].stack,
      });
    } else {
      res.status(Status.OK)
        .json(result);
    }
  }).catch(() => {
    next();
  });
};
