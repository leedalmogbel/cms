module.exports = {
  Query: {
    getTags: (_, args, { container, res }) => {
      const operation = container.resolve('ListTags');
      return operation.execute(args);
    },
    getTag: (_, args, { container, res }) => {
      const operation = container.resolve('ShowTag');
      return operation.execute(args);
    },
  },
  Mutation: {
    createTag: (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateTag');
      return operation.execute(args);
    },
    updateTag: (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdateTag');
      return operation.execute(args);
    },
    deleteTag: (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteTag');
      return operation.execute(args);
    },
  },
};
