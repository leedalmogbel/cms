module.exports = {
  Query: {
    getCategories: (_, args, { container, res }) => {
      const operation = container.resolve('ListCategories');
      return operation.execute(args);
    },
    getCategory: (_, args, { container, res }) => {
      const operation = container.resolve('ShowCategory');
      return operation.execute(args);
    },
  },
  Mutation: {
    createCategory: (_, args, { container, res }) => {
      const operation = container.resolve('CreateCategory');
      return operation.execute(args);
    },
    updateCategory: (_, args, { container, res }) => {
      const operation = container.resolve('UpdateCategory');
      return operation.execute(args);
    },
    deleteCategory: (_, args, { container, res }) => {
      const operation = container.resolve('DeleteCategory');
      return operation.execute(args);
    },
  },
};
