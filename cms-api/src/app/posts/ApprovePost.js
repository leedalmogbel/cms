const { Operation } = require('@brewery/core');

class ApprovePost extends Operation {
  constructor({
    PostRepository, UserRepository, NotificationRepository,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.NotificationRepository = NotificationRepository;
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

    data = {
      ...data,
      publishedAt: new Date().toISOString(),
      status: 'published',
    };

    try {
      const post = await this.PostRepository.update(id, data);

      await this.NotificationRepository.add({
        userId: post.userId,
        message: 'Your Post has been approved.',
        meta: {},
        active: 1,
      });

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }
  }
}

ApprovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ApprovePost;
