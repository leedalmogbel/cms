const { graphql } = require('graphql');
const Status = require('http-status');
const Schema = require('./schema');

module.exports = async (req, res, next) => {
  const { query, variables } = req.body;
  const { container } = req;
  const logger = container.resolve('logger');

  graphql(Schema, query, null, {
    container, res, next
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
