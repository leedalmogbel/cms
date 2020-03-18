
const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class HistoryRepository extends BaseRepository {
  constructor
  ({ HistoryModel }) {
    super(HistoryModel);
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {
      where: {
        isActive: 1,
      },
      limit: 20,
    };

    // offset
    if ('offset' in data) {
      args.offset = Number(data.offset);
    }

    // limit
    if ('limit' in data) {
      args.limit = Number(data.limit);
    }

    return args;
  }

  getHistoryByPostId(postId) {
    return this.getAll({
      postId
    });
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = HistoryRepository;

