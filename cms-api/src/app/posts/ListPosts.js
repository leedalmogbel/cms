const { Operation } = require('@brewery/core');

class ListPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      let posts = await this.PostRepository.getPosts(args);
      posts = posts.map((post) => {
        post = {
          ...post.toJSON(),
          status: 'draft',
        };

        if (post.publishedAt) {
          post.status = 'published';
        }

        if (post.scheduledAt) {
          post.status = 'scheduled';
        }

        return post;
      });

      const total = await this.PostRepository.count(args);

      this.emit(SUCCESS, {
        error: null,
        results: posts,
        meta: {
          total,
        },
      });
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
