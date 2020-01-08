const { Operation } = require('../../infra/core/core');

class SavePost extends Operation {
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
      prevPost = prevPost.toJSON();
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data = await this.PostUtils.build(data);

    try {
      await this.PostRepository.update(id, data);
      let post = await this.PostRepository.getPostById(id);
      post = post.toJSON();

      await this.PostUtils.postNotifications(prevPost, post);
      await this.PostUtils.firehoseUpdate(post);
      await this.PostUtils.pmsUpdate(post);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SavePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SavePost;
