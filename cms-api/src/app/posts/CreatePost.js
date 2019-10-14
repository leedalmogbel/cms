const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class CreatePost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(data) {
    const post = new Post(data);
    
    try {
      const newPost = (await this.PostRepository.add(post)).toJSON();
      
      return newPost;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = CreatePost;
