const Status = require('http-status');

module.exports = {
  Query: {
    post: async (_, args, { container }) => {
      const operation = container.resolve('ShowPost');
      return operation.execute(args);
    },
  },  
  Mutation: {
    createPost: async (_, args, { container },
    ) => {
      const operation = container.resolve('CreatePost');
      return operation.execute(args);
    },
  },
};