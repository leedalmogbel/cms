const { Operation } = require('../../infra/core/core');

class ListPosts extends Operation {
  constructor({ PostRepository, PostTagRepository }) {
    super();

    this.PostRepository = PostRepository;
    this.PostTagRepository = PostTagRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      let posts = await this.PostRepository.getPosts(args);
      let total = await this.PostRepository.count(args);

      if ('keyword' in args) {
        const postIds = posts.map((post) => post.id);
        const postTags = await this.PostTagRepository.filterPostTagsByName(args.keyword);
        const postTagIds = postTags.map((pTags) => pTags.postId);

        posts = await this.PostRepository.getPosts({
          ...args,
          ids: Array.from(new Set([...postIds, ...postTagIds])),
        });

        total = await this.PostRepository.count({
          ...args,
          ids: Array.from(new Set([...postIds, ...postTagIds])),
        });
      }

      posts = posts.map((post) => {
        post = {
          ...post.toJSON(),
        };
        const exprd = post.expiredAt;
        if (exprd.includes('1970')) {
          post.expiredAt = null;
        }

        post.scheduledAt = post.scheduledAt !== '1970-01-01 08:00:00' ? post.scheduledAt : null;

        return post;
      });

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
