const { Operation } = require('../../infra/core/core');

class ApprovePost extends Operation {
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

    data.status = 'published';
    if ('scheduledAt' in data) {
      data.status = 'scheduled';
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    }

    if (data.status === 'published') {
      data.publishedAt = new Date().toISOString();
    }

    try {
      data = await this.PostUtils.build(data);
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      if (post.scheduledAt) {
        return this.emit(SUCCESS, {
          results: { id },
          meta: {},
        });
      }

      const { postId, contributors } = post;
      if ('writers' in contributors && contributors.writers.length) {
        const writerId = contributors.writers[0].id;

        this.PostUtils.saveNotification({
          userId: writerId,
          message: `Your Post "${post.title}" has been approved.`,
          meta: { id, postId },
        });
      }

      await this.PostUtils.firehoseIntegrate(post.toJSON());
      await this.PostUtils.pmsIntegrate(post.toJSON());

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ApprovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ApprovePost;
