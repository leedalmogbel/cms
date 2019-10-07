const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class CreatePost extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute(data) {
    console.log({data});
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
    const post = new Post(data);
    
    try {
      const newPost = (await this.PostRepository.add(post)).toJSON();
      console.log(newPost);
      this.emit(SUCCESS, newPost);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
  
      this.emit(ERROR, error);
    }
  }
}

CreatePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreatePost;
