const Status = require('http-status');

module.exports = {
  Query: {
    users: async (_, args, { container, res }) => {
      const operation = container.resolve('ListUsers');
      const { SUCCESS, NOT_FOUND} = operation.events;

      operation
        .on(SUCCESS, (result) => {
          res
            .status(Status.OK)
            .json(result);
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        });

      await operation.execute(args);
    },
  },  
  Mutation: {
    createUser: async (_, args, { container, res, next },
    ) => {

      const operation = container.resolve('CreateUser');
      const { SUCCESS, ERROR, VALIDATION_ERROR } = operation.events;

      operation
        .on(SUCCESS, (result) => {
          res
            .status(Status.CREATED)
            .json(result);
        })
        .on(VALIDATION_ERROR, (error) => {
          res.status(Status.BAD_REQUEST).json({
            type: 'ValidationError',
            details: error.details
          });
        })
        .on(ERROR, next);
      await operation.execute(args);
    },

  },
};