const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class CreatePost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ where: {id}, data }) {
    try {
      // validate post
      await this.PostRepository.getById(id);
    } catch (error) {
      throw new Error('Post does not exists.');
    }

    try {
      // update post
      await this.PostRepository.update(id, data);
      
      // return true as success response
      return true;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CreatePost;
