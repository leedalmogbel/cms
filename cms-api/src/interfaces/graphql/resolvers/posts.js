const Status = require('http-status');

module.exports = {
  Query: {
    post: async (_, args, { container, res }) => {
      const operation = container.resolve('ShowPost');
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
  }
};