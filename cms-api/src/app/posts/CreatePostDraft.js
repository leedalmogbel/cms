const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const Helpers = require('src/interfaces/http/utils/helpers');

class CreatePostDraft extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute() {
    let newPost;

    const data = {
      draft: true,
      postId: Helpers.generateUID(8),
    };


    const payload = new Post(data);

    try {
      newPost = await this.PostRepository.add(payload);
    } catch (err) {
      throw err;
    }

    return { id: newPost.id };
  }
}

module.exports = CreatePostDraft;
