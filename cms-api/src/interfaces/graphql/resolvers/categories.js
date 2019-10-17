const Status = require('http-status');

module.exports = {
  Query: {
    getCategories: (_, args, { container, res }) => {
      const operation = container.resolve('ListCategories');
      
      // fetch categories
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getCategory: (_, args, { container, res }) => {
      const operation = container.resolve('ShowCategory');

      //  fetch category
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  },  
  Mutation: {
    createCategory: (_, args, { container, res }) => {
      const operation = container.resolve('CreateCategory');

      // create category
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    updateCategory: (_, args, { container, res }) => {
      const operation = container.resolve('UpdateCategory');

      // update category
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    deleteCategory: (_, args, { container, res }) => {
      const operation = container.resolve('DeleteCategory');

      // delete category
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  }
};