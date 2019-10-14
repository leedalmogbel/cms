const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ where: { id } }) {
    try {
      const post = await this.PostRepository.getById(id);
      return post;
    } catch(error) {
      throw new Error('Post does not exists.');
    }
  }
}

module.exports = ShowPost;
