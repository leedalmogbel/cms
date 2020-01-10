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

    let oldPost;
    try {
      oldPost = await this.PostRepository.getById(id);
      oldPost = oldPost.toJSON();
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data = await this.PostUtils.build(data);

    try {
      await this.PostRepository.update(id, data);
      let post = await this.PostRepository.getPostById(id);
      post = post.toJSON();

      await this.PostUtils.postNotifications(oldPost, post);
      await this.PostUtils.firehoseUpdate(post, oldPost);
      await this.PostUtils.pmsIntegrate(post);

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
