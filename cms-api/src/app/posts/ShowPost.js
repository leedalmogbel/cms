const { Operation } = require('@brewery/core');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;
    try {
      const post = await this.PostRepository.getById(id);
      this.emit(SUCCESS, {
        error: null,
        results: post,
        meta: {},
      });
    } catch (error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details,
      });
    }
  }
}

ShowPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ShowPost;
