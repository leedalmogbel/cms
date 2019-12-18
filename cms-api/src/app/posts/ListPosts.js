const { Operation } = require('../../infra/core/core');

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
        };
        post.expiredAt = post.expiredAt !== '1970-01-01 08:00:00' ? post.expiredAt : null;

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
