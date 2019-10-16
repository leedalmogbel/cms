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
      // create post operation
      const operation = container.resolve('CreatePost');
      const post = await operation.execute(args);

      // if post tags exists
      if ('tags' in args.data) {
        const tagOperation = container.resolve('CreateTag');
        const tags = args.data.tags;

        // process post tags function
        processTags = async (tags) => {
          for (let tag of tags) {
            const newTag = await tagOperation.execute({ data: tag });
            await post.addTag(newTag);
          }
        }

        // process and associate tags
        await processTags(tags);
        
        // fetch associated post tags
        post.tags = post.getTags();
      }

      // return created post
      return post;
    },
    updatePost: async (_, args, { container, res, next }) => {
      // udpate post 
      const operation = container.resolve('UpdatePost');
      await operation.execute(args);

      // if post tags exists
      if ('tags' in args.data) {
        // fetch updated post
        const fetchOperation = container.resolve('ShowPost');
        const post = await fetchOperation.execute({ where: { id: args.where.id } });

        // tag operation
        const tagOperation = container.resolve('CreateTag');
        const tags = args.data.tags;

        // process post tags function
        processTags = async (tags) => {
          for (let tag of tags) {
            const newTag = await tagOperation.execute({ data: tag });
            await post.addTag(newTag);
          }
        }

        // first remove tags
        await post.setTags([]);

        // process and associate tags
        await processTags(tags);
      }
      
      return true;
    }
  }
};