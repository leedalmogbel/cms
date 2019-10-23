module.exports = {
  Query: {
    getPosts: (_, args, { container, res }) => {
      const operation = container.resolve('ListPosts');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getPost: (_, args, { container, res }) => {
      const operation = container.resolve('ShowPost');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  },  
  Mutation: {
    createPostDraft: (_, args, { container, res, next }) => {
      const operation = container.resolve('CreatePostDraft');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    savePost: (_, args, { container, res, next }) => {
      const operation = container.resolve('SavePost');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    publishPost: (_, args, { container, res, next }) => {
      const operation = container.resolve('PublishPost');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  }
};