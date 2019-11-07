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

      this.emit(SUCCESS, posts.map((post) => {
        post = {
          ...post.toJSON(),
          status: 'draft',
        };

        if (post.scheduledAt
          && !post.publishedAt) {
          post.status = 'scheduled';
        }

        if (post.publishedAt) {
          post.status = 'published';
        }

        return post;
      }));
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
