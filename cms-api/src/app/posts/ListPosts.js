const { Operation } = require('@brewery/core');

class ListPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute() {
    try {
      // get posts
      const tags = await this.PostRepository.getAll();
      return tags;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = ListPosts;
    
