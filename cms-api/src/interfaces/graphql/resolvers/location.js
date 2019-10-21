const Status = require('http-status');

module.exports = {
  Query: {
    getLocation: (_, args, { container, res }) => {
      const operation = container.resolve('ShowLocation');

      // fetch posts
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  },  
  Mutation: {}
};