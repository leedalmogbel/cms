const { Operation } = require('@brewery/core');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const post = await this.PostRepository.getById(id);
      this.emit(SUCCESS, {
        results: post,
        meta: {},
      });
    } catch (error) {
      error.message = 'Post not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

ShowPost.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ShowPost;
