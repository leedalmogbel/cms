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

    const autosave = 'autosave' in data;
    let oldPost;

    try {
      oldPost = await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data = await this.PostUtils.build(data);

    try {
      // if autosave use silent update
      if (autosave) {
        oldPost.update(data, {
          silent: true,
        });
      } else {
        await this.PostRepository.update(id, data);
      }

      let post = await this.PostRepository.getPostById(id);
      post = post.toJSON();
      oldPost = oldPost.toJSON();

      await this.PostUtils.postNotifications(oldPost, post);
      await this.PostUtils.firehoseIntegrate(oldPost, post);
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
