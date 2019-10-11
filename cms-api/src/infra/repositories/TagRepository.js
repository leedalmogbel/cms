
const { BaseRepository } = require('@brewery/core');

class TagRepository extends BaseRepository {
  constructor({ TagModel }) {
    super(TagModel);
  }
}

module.exports = TagRepository;

