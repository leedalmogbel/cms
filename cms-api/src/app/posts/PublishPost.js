const { Operation } = require('../../infra/core/core');

class PublishPost extends Operation {
  constructor({ PostRepository, UserRepository, PostUtils }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
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

    data.status = await this.getStatus(data);
    if (data.status === 'published') {
      data.publishedAt = new Date().toISOString();
    }

    if ('scheduledAt' in data) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
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

      await this.PostUtils.firehoseIntegrate(post.toJSON());
      await this.PostUtils.pmsIntegrate(post.toJSON());
      await this.PostUtils.postNotifications(prevPost, post);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async getStatus(data) {
    const { NOT_FOUND } = this.events;

    try {
      let user = await this.UserRepository.getUserById(data.userId);
      user = user.toJSON();

      if (user.role.title === 'writer') {
        return 'for-approval';
      }

      if (data.scheduledAt && !data.publishedAt) {
        return 'scheduled';
      }

      return 'published';
    } catch (error) {
      error.message = 'User not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

PublishPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishPost;
