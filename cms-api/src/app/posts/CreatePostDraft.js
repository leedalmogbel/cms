const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const Helpers = require('src/interfaces/http/utils/helpers');

class CreatePostDraft extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute() {
    const data = {
      draft: true,
      postId: `KAPP-CMS-${Helpers.generateUID(8)}`,
    };

    const payload = new Post(data);
    const newPost = await this.PostRepository.add(payload);

    return { id: newPost.id };
  }
}

module.exports = CreatePostDraft;
