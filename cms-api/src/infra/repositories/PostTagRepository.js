const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostTagRepository extends BaseRepository {
  constructor({ PostTagModel }) {
    super(PostTagModel);
  }

  getTagByName(name) {
    return this.model.findOne({
      where: {
        name,
      },
    });
  }

  getPostIdByTagName(name) {
    return this.model.findOne({
      where: {
        name,
      },
    });
  }

  deletePostTagById(postTagId) {
    return this.model.destroy({
      where: {
        id: postTagId,
      },
    });
  }
}

module.exports = PostTagRepository;
