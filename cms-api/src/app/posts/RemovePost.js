const { Operation } = require('../../infra/core/core');

class RemovePost extends Operation {
  constructor({ PostRepository, PostUtils }) {
    super();
    this.PostRepository = PostRepository;
    this.PostUtils = PostUtils;
  }

  async execute(id, data) {
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
      await this.PostRepository.update(id, data = {
        ...data,
        isActive: 0,
      });

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RemovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RemovePost;
