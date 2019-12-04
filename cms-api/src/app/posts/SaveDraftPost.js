const { Operation } = require('@brewery/core');

class SaveDraftPost extends Operation {
  constructor({ PostRepository, PublishPost, SavePost }) {
    super();
    this.PostRepository = PostRepository;
    this.SavePost = SavePost;
    this.PublishPost = PublishPost;
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

    data = await this.SavePost.build({
      ...data,
      status: 'draft',
    });

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      await this.PublishPost
        .postNotifications(prevPost, post);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SaveDraftPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveDraftPost;
