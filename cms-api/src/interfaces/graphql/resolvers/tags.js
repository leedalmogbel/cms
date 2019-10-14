const Status = require('http-status');

module.exports = {
  Query: {
    tags: async (_, args, { container, res }) => {
      const operation = container.resolve('ListTags');
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
    tag: async (_, args, { container, res }) => {
      const operation = container.resolve('ShowTag');
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
    }
  },  
  Mutation: {
    createTag: async (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateTag');
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
    updateTag: async (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdateTag');
      const { SUCCESS, ERROR, VALIDATION_ERROR } = operation.events;

      operation
        .on(SUCCESS, (result) => {
          res
            .status(Status.OK)
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
    deleteTag: async (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteTag');
      const { SUCCESS, ERROR, VALIDATION_ERROR } = operation.events;

      operation
        .on(SUCCESS, (result) => {
          res
            .status(Status.OK)
            .json({
              message: 'Tag successfully deleted'
            });
        })
        .on(VALIDATION_ERROR, (error) => {
          res.status(Status.BAD_REQUEST).json({
            type: 'ValidationError',
            details: error.details
          });
        })
        .on(ERROR, next);

      await operation.execute(args);
    }
  }
};