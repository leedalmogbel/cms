
const { BaseRepository } = require('@brewery/core');

class TagRepository extends BaseRepository {
  constructor({ TagModel }) {
    super(TagModel);
  }

  getTagByName(name) {
    return this.model.findOne({
      where: {
        name
      }
    });
  }
}

module.exports = TagRepository;

