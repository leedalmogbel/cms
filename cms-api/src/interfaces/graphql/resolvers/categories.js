const Status = require('http-status');

module.exports = {
  Query: {
    getCategories: async (_, args, { container, res }) => {
      const operation = container.resolve('ListCategories');
      
      // fetch categories
      const categories = await operation.execute(args);
      return categories;
    },
    getCategory: async (_, args, { container, res }) => {
      const operation = container.resolve('ShowCategory');

      //  fetch category
      const category = await operation.execute(args);
      return category;
    }
  },  
  Mutation: {
    createCategory: async (_, args, { container, res }) => {
      const operation = container.resolve('CreateCategory');

      // create category
      const category = await operation.execute(args);
      return category;
    },
    updateCategory: async (_, args, { container, res }) => {
      const operation = container.resolve('UpdateCategory');

      // create category
      const category = await operation.execute(args);
      return category;
    },
    deleteCategory: async (_, args, { container, res }) => {
      const operation = container.resolve('DeleteCategory');

      // create category
      const category = await operation.execute(args);
      return category;
    }
  }
};