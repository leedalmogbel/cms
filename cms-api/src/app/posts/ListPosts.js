const { Operation } = require('@brewery/core');

class ListPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(args) {
    // get posts
    let posts = await this.PostRepository.getPosts(args);

    // get post tags
    posts = posts.map((post) => ({
      ...post.toJSON(),
      tags: post.getPostTags(),
    }));

    // return posts
    return posts;
  }
}

module.exports = ListPosts;
