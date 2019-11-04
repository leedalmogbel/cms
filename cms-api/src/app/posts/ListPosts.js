const { Operation } = require('@brewery/core');

class ListPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const posts = await this.PostRepository.getPosts(args);
      this.emit(SUCCESS, await posts.map((post) => ({
        ...post.toJSON(),
        tags: post.getPostTags(),
        status: (post.scheduledAt) ? 'scheduled' : 'published',
      })));
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

ListPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListPosts;
