const Post = require('src/domain/Post');
const { Operation } = require('../../infra/core/core');

class CreateInitialPost extends Operation {
  constructor({ PostRepository, PostUtils }) {
    super();
    this.PostRepository = PostRepository;
    this.PostUtils = PostUtils;
  }

  async execute() {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      const postId = await this.PostUtils.generateUid();
      const data = {
        status: 'initial',
        postId,
      };

      const payload = new Post(data);
      const { id } = await this.PostRepository.add(payload);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

CreateInitialPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateInitialPost;
