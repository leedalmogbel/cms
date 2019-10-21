const { Operation } = require('@brewery/core');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ where: { id } }) {
    try {
      // get post
      const post = await this.PostRepository.getById(id);
      // get associated tags
      post.tags = await post.getPostTags();
      // return post
      return post;
    } catch(error) {
      throw new Error('Post does not exists.');
    }
  }
}

module.exports = ShowPost;
