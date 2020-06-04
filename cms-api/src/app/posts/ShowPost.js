const { Operation } = require('../../infra/core/core');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;
    let post;

    try {
      post = await this.PostRepository.getPostById(id);
      post = post.toJSON();
      post.expiredAt = post.expiredAt !== '1970-01-01 08:00:00' ? post.expiredAt : null;
    } catch (error) {
      return this.emit(NOT_FOUND, new Error('Post not found'));
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

    this.emit(SUCCESS, {
      results: post,
      meta: {},
    });
  }
}

ShowPost.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ShowPost;
