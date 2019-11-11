const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const uuidv1 = require('uuid/v1');

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
        postId: `kapp-cms-${uuidv1()}`,
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

CreatePostDraft.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreatePostDraft;
