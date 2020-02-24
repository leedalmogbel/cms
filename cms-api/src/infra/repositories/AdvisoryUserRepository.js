const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class AdvisoryUserRepository extends BaseRepository {
  constructor({ AdvisoryUserModel }) {
    super(AdvisoryUserModel);
  }

  getAdvisoryUserById(advisoryId, userId) {
    return this.model.findOne({
      where: {
        userId,
        advisoryId,
      },
    });
  }

  filterAdvisoryUserByUserId(userId) {
    return this.model.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
    });
  }

  getUserIds() {
    return this.model.findAll({
      group: ['userId'],
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

module.exports = AdvisoryUserRepository;
