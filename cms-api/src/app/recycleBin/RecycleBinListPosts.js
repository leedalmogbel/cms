const { Operation } = require('../../infra/core/core');

class RecycleBinListPosts extends Operation {
  constructor({ RecycleBinRepository }) {
    super();
    this.RecycleBinRepository = RecycleBinRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      let posts = await this.RecycleBinRepository.getList(args);
      posts = posts.map((post) => {
        post = {
          ...post.toJSON(),
        };
        post.meta.expiredAt = post.meta.expiredAt !== '1970-01-01 08:00:00' ? post.meta.expiredAt : null;
        post.meta.scheduledAt = post.meta.scheduledAt !== '1970-01-01 08:00:00' ? post.meta.scheduledAt : null;

        return post;
      });

      const total = await this.RecycleBinRepository.count(args);

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

RecycleBinListPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RecycleBinListPosts;
