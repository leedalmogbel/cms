const { Operation } = require('@brewery/core');


class ListPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(args) {
    try {
      // get posts
      const tags = await this.PostRepository.getPosts(args);
      return tags;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = ListPosts;
    
