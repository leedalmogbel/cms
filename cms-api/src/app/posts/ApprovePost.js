const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class ApprovePost extends Operation {
  constructor({
    PostRepository, PublishPost, UserRepository,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.PublishPost = PublishPost;
    this.UserRepository = UserRepository;
  }

  async execute(id, data = {}) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      await this.PostRepository.update(id, {
        publishedAt: new Date().toISOString(),
        status: 'published',
      });

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }
  }
}

ApprovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ApprovePost;
