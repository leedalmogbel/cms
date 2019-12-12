const { Operation } = require('../../infra/core/core');

class SaveRawPost extends Operation {
  constructor({ PostRepository, PostUtils }) {
    super();
    this.PostRepository = PostRepository;
    this.PostUtils = PostUtils;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let prevPost;
    try {
      prevPost = await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data = await this.PostUtils.build(data);

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      // NOTE: Disable for now
      // await this.PostUtils.postNotifications(prevPost, post);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SaveRawPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveRawPost;
