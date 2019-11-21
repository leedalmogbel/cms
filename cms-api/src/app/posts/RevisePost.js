const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class RevisePost extends Operation {
  constructor({ PostRepository, GetLocation, SavePost }) {
    super();
    this.PostRepository = PostRepository;
    this.GetLocation = GetLocation;
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

    try {
      data = await this.SavePost.build(data = {
        ...data,
        status: 'for-revision',
      });
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
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
