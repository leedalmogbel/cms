
const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class HistoryRepository extends BaseRepository {
  constructor({ HistoryModel }) {
    super(HistoryModel);
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {
      where: {
        [Op.and]: {
          isActive: 1,
          parentId: Number(data.id),
          type: data.type,
        },
      },
      order: [['createdAt', 'DESC']],
    };

    return args;
  }

  getHistories(args) {
    return this.getAll({
      ...this.buildListArgs(args),
    });
  }

  getHistoryByPostId(postId, type) {
    return this.getAll({
      where: {
        parentId: postId,
        type,
      },
      raw: true,
    });
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = HistoryRepository;
