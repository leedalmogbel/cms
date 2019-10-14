const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class CreatePost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute({ data }) {
    // build post data
    const post = new Post(data);
    
    // create post
    try {
      const newPost = await this.PostRepository.add(post);
      return newPost;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CreatePost;
