const { Operation } = require('../../infra/core/core');

class ListPosts extends Operation {
  constructor({ PostRepository, PostTagRepository, HistoryRepository }) {
    super();

    this.PostRepository = PostRepository;
    this.PostTagRepository = PostTagRepository;
    this.HistoryRepository = HistoryRepository;
  }

  async execute(args, session) {
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
        post = post.toJSON();
        const {
          isLocked,
          lockUser,
          expiredAt,
          scheduledAt,
        } = post;

        if (scheduledAt !== null) {
          post.scheduledAt = scheduledAt.includes('1970') ? null : scheduledAt;
        }

        if (expiredAt !== null) {
          post.expiredAt = expiredAt.includes('1970') ? null : expiredAt;
        }

        if (isLocked && lockUser && session) {
          if (parseInt(lockUser.userId, 10) === session.id) {
            post.isLocked = null;
            post.lockUser = null;
          }
        }

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
