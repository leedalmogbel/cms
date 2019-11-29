const { Operation } = require('@brewery/core');

class ApprovePost extends Operation {
  constructor({
    PostRepository, NotificationRepository, PublishPost, SavePost,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.NotificationRepository = NotificationRepository;
    this.PublishPost = PublishPost;
    this.SavePost = SavePost;
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
      data = await this.SavePost.build(data);
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      await this.NotificationRepository.add({
        userId: post.userId,
        message: 'Your Post has been approved.',
        meta: {},
        active: 1,
      });

      if (post.scheduledAt) {
        return this.emit(SUCCESS, {
          results: { id },
          meta: {},
        });
      }

      await this.PublishPost.firehoseIntegrate(post.toJSON());
      await this.PublishPost.pmsIntegrate(post.toJSON());

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
