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
      for (let post of posts) {
        post.tags = await post.getTags();
      }

      // return posts
      return posts;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = ListPosts;
    
