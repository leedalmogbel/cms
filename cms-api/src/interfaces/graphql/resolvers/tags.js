const Status = require('http-status');

module.exports = {
  Query: {
    getTags: (_, args, { container, res }) => {
      const operation = container.resolve('ListTags');
      
      // fetch tags
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getTag: (_, args, { container, res }) => {
      const operation = container.resolve('ShowTag');

      //  fetch tag
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  },  
  Mutation: {
    createTag: (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateTag');

      // create tag
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    updateTag: (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdateTag');

      // update tag
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    deleteTag: (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteTag');

      // delete tag
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  }
};