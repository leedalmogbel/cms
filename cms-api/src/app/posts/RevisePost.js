const { Operation } = require('../../infra/core/core');

class RevisePost extends Operation {
  constructor({ PostRepository, UserRepository, PostUtils }) {
    super();
    this.UserRepository = UserRepository;
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

    try {
      data = await this.PostUtils.build({
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
      const { postId, contributors } = post;

      // send notification
      if ('writers' in contributors && contributors.writers.length) {
        const writerId = contributors.writers[0].id;

        // format message
        let message = `Your Post "${post.title}" has been rejected.`;
        if (post.userId) {
          const author = await this.UserRepository.getById(post.userId);
          if (author) {
            message = `${author.firstName} ${author.lastName} returned a post for revision ${post.title}`;
          }
        }

        await this.PostUtils.saveNotification({
          userId: writerId,
          message,
          meta: { id, postId },
        });
      }

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
