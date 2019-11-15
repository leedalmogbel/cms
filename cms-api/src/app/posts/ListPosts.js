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

        if (post.scheduledAt
          && !post.publishedAt) {
          post.status = 'scheduled';
        }

        if (post.publishedAt) {
          post.status = 'published';
        }

        return post;
      });

      const total = await this.PostRepository.count(args);

      this.emit(SUCCESS, {
        results: posts,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListPosts;
