const { Operation } = require('@brewery/core');

class AddPostComment extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR,
    } = this.events;

    let post = {};

    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      await this.PostRepository.update(id, data = {
        ...data,
        updatedAt: post.updateAt,
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

AddPostComment.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = AddPostComment;
