const Status = require('http-status');

module.exports = {
  Query: {
    tags: async (_, args, { container, res }) => {
      const operation = container.resolve('ListTags');
      
      // fetch tags
      const tags = await operation.execute(args);
      return tags;
    },
    tag: async (_, args, { container, res }) => {
      const operation = container.resolve('ShowTag');

      //  fetch tag
      const tag = await operation.execute(args);
      return tag;
    }
  },  
  Mutation: {
    createTag: async (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateTag');

      // create tag
      const tag = await operation.execute(args);
      return tag;
    },
    updateTag: async (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdateTag');

      // update tag
      const tag = await operation.execute(args);
      return tag;
    },
    deleteTag: async (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteTag');

      // delete tag
      const result = await operation.execute(args);
      return result;
    }
  }
};