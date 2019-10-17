const Status = require('http-status');

module.exports = {
  Query: {
    getPosts: (_, args, { container, res }) => {
      const operation = container.resolve('ListPosts');

      // fetch posts
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getPost: (_, args, { container, res }) => {
      const operation = container.resolve('ShowPost');

      // fetch post
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  },  
  Mutation: {
    createPost: (_, args, { container, res, next }) => {
      const operation = container.resolve('CreatePost');

      // create post
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    updatePost: (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdatePost');

      // udpate post 
      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  }
};