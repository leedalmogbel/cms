const { Operation } = require('@brewery/core');
const TagModel = require('src/infra/models/TagModel');
const PostTagModel = require('src/infra/models/PostTagModel');

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
      post.tags = await post.getTags();
      // return post
      return post;
    } catch(error) {
      throw new Error('Post does not exists.');
    }
  }
}

module.exports = ShowPost;
