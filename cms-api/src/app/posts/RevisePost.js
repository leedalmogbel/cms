const { Operation } = require('@brewery/core');

class RevisePost extends Operation {
  constructor({ PostRepository, SavePost, NotificationRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.SavePost = SavePost;
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

    try {
      data = await this.SavePost.build(data = {
        ...data,
        status: 'for-revision',
      });
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      await this.NotificationRepository.add({
        userId: post.userId,
        message: 'Your Post has been rejected.',
        meta: {},
        active: 1,
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

RevisePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RevisePost;
