const Status = require('http-status');

module.exports = {
  Query: {
    getPosts: async (_, args, { container, res }) => {
      const operation = container.resolve('ListPosts');

      // fetch posts
      const posts = await operation.execute(args);
      return posts;
    },
    getPost: async (_, args, { container, res }) => {
      const operation = container.resolve('ShowPost');
      
      // fetch post
      const post = await operation.execute(args);
      return post;
    }
  },  
  Mutation: {
    createPost: async (_, args, { container, res, next }) => {
      const operation = container.resolve('CreatePost');

      // create post
      const post = await operation.execute(args);
      return post;
    },
    // updatePost: async (_, args, { container, res, next }) => {
    //   const operation = container.resolve('UpdatePost');

    //   // udpate post
    //   const post = await operation.execute(args);
    //   return post;
    // },
  },
};