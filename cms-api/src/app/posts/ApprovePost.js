const { Operation } = require('../../infra/core/core');

class ApprovePost extends Operation {
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

    let oldPost;
    try {
      oldPost = await this.PostRepository.getById(id);
      oldPost = oldPost.toJSON();
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data.status = await this.getStatus(data);
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
      let post = await this.PostRepository.getPostById(id);
      post = post.toJSON();

      if (post.status === 'scheduled') {
        return this.emit(SUCCESS, {
          results: { id },
          meta: {},
        });
      }

      const { postId, contributors } = post;
      if ('writers' in contributors && contributors.writers.length) {
        const writerId = contributors.writers[0].id;

        // format message
        let message = `Your Post "${post.title}" has been approved.`;
        if (post.userId) {
          const author = await this.UserRepository.getById(post.userId);
          if (author) {
            message = `${author.firstName} ${author.lastName} approve your post ${post.title}`;
          }
        }

        await this.PostUtils.saveNotification({
          userId: writerId,
          message,
          meta: { id, postId },
        });
      }

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

ApprovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ApprovePost;
