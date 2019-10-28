module.exports = {
  Query: {
    getPosts: (_, args, { container }) => {
      const operation = container.resolve('ListPosts');
      return operation.execute(args);
    },
    getPost: (_, args, { container }) => {
      const operation = container.resolve('ShowPost');
      return operation.execute(args);
    },
  },
  Mutation: {
    createPostDraft: (_, args, { container }) => {
      const operation = container.resolve('CreatePostDraft');
      return operation.execute(args);
    },
    savePost: (_, args, { container }) => {
      const operation = container.resolve('SavePost');
      return operation.execute(args);
    },
    publishPost: (_, args, { container }) => {
      const operation = container.resolve('PublishPost');
      return operation.execute(args);
    },
  },
};
