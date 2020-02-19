const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostAdvisoryRepository extends BaseRepository {
  constructor({ PostAdvisoryModel }) {
    super(PostAdvisoryModel);
  }

  getPostAdvisoryById(postId, advisoryId) {
    return this.model.findOne({
      where: {
        postId,
        advisoryId,
      },
    });
  }

  getAdvisoryIds() {
    return this.model.findAll({
      group: ['advisoryId'],
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

module.exports = PostAdvisoryRepository;
