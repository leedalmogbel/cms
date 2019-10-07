const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ where: { id } }) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const post = (await this.PostRepository.getById(id)).toJSON();
      
      this.emit(SUCCESS, {
        id: post.id,
        data: {
          body: post.data.body,
          createdAt: post.createdAt
        }
      });
      
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

ShowPost.setEvents(['SUCCESS', 'NOT_FOUND']);

module.exports = ShowPost;
