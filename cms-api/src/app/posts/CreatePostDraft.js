const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const Helpers = require('src/interfaces/http/utils/helpers');

class CreatePostDraft extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
  }

  async execute() {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
    try {
      const data = {
        draft: true,
        postId: `KAPP-CMS-${Helpers.generateUID(8)}`,
      };

      const payload = new Post(data);
      const { id } = await this.PostRepository.add(payload);

      this.emit(SUCCESS, { id });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

CreatePostDraft.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreatePostDraft;
