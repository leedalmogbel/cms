const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostAdvisoryRepository extends BaseRepository {
  constructor({ PostAdvisoryModel, PostModel }) {
    super(PostAdvisoryModel);

    this.PostModel = PostModel;
  }

  getPostAdvisoryById(postId, advisoryId) {
    return this.model.findOne({
      where: {
        postId,
        advisoryId,
      },
    });
  }

  getPostsByAdvisoryId(advisoryId) {
    return this.model.findAll({
      where: { advisoryId },
      group: ['postId'],
      raw: true,
      attributes: {
        exclude: ['id', 'advisoryId', 'createdAt', 'updatedAt'],
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
