
const { BaseRepository } = require('@brewery/core');

class PostRepository extends BaseRepository {
  constructor({ PostModel }) {
    super(PostModel);
  }
}

module.exports = PostRepository;

