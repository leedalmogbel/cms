
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

    const order = [['updatedAt', 'DESC']];

    // set keyword
    if ('keyword' in data
      && data.keyword) {
      args.where[Op.or] = {
        title: {
          [Op.like]:
            `%${data.keyword}%`,
        },
      };
    }

    args.order = order;

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

  getTags(args) {
    return this.getAll({
      ...this.buildListArgs(args),
    });
  }

  getTagById(id) {
    return this.model.findOne({
      where: {
        id,
        isActive: 1,
      },
    });
  }

  getTagByName(name) {
    return this.model.findOne({
      where: {
        name,
        isActive: 1,
      },
    });
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = HistoryRepository;

