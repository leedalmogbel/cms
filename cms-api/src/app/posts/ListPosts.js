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
      const total = await this.PostRepository.count(args);

      posts = await Promise.all(
        posts.map(async (post) => {
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
  
          if (post.categoryId) {
            try {
              post.category = await this.PostRepository
                .getPostCategory(post.categoryId);
            } catch (e) {}
          }
      
          if (post.subCategoryId) {
            try {
              post.subCategory = await this.PostRepository
                .getPostSubCategory(post.subCategoryId);
            } catch (e) {}
          }
  
          if (isLocked && lockUser && session) {
            if (parseInt(lockUser.userId, 10) === session.id) {
              post.isLocked = null;
              post.lockUser = null;
            }
          }
  
          return post;
        })
      );

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
