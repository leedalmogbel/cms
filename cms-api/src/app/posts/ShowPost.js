const { Operation } = require('@brewery/core');

class ShowPost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ where: { id } }) {
    // get post and associated tags
    const post = await this.PostRepository.getById(id);
    post.tags = post.getPostTags();

    return post;
  }
}

module.exports = ShowPost;
