const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const Tag = require('src/domain/Tag');
const Helpers = require('src/interfaces/http/utils/helpers');

class CreatePost extends Operation {
  constructor({ PostRepository, TagRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.TagRepository = TagRepository;
  }

  async execute() {
    let newPost;

    // set data and generate postId
    const data = {
      draft: true,
      postId: Helpers.generateUID(8)
    };

    // build post payload
    const payload = new Post(data);
    
    // create post
    try {
      newPost = await this.PostRepository.add(payload);
    } catch(err) {
      throw err;
    }

    // return new post
    return { id: newPost.id };
  }
}

module.exports = CreatePost;
