const { Operation } = require('@brewery/core');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ where: { id } }) {
    // get post and associated tags
    try {
      const post = await this.PostRepository.getById(id);
      post.tags = post.getPostTags();

      return post;
    } catch (err) {
      throw new Error('Post does not exists.');
    }
  }
}

module.exports = ShowPost;
