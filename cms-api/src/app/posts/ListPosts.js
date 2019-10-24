const { Operation } = require('@brewery/core');

class ListPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(args) {
    try {
      // get posts
      const posts = await this.PostRepository.getPosts(args);

      // get post tags
      for (const post of posts) {
        post.tags = await post.getPostTags();
      }

      // return posts
      return posts;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ListPosts;
