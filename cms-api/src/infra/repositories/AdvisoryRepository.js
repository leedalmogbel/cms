
const { BaseRepository } = require('@brewery/core');
const Sequelized = require('sequelize');

const { Op } = Sequelized;

class AdvisoryRepository extends BaseRepository {
  constructor({ AdvisoryModel }) {
    super(AdvisoryModel);
  }

  buildListArgs(data) {
    // init fetch arguments
    const args = {
      where: {
        draft: false, // default draft false
      },
    };

    const order = [['createdAt', 'DESC']]; // set order by default descending

    // fetch verified
    if ('verified' in data) {
      if (data.verified) {
        args.where.verified = {
          [Op.eq]: true,
        };
      } else {
        args.where.verified = {
          [Op.eq]: false,
        };
      }
    }

    // offset
    if ('offset' in args) {
      args.offset = data.offset;
    }

    // limit
    if ('limit' in args) {
      args.limit = data.limit;
    }

    // order
    args.order = order;

    return args;
  }

  getAdvisories(args) {
    return this.getAll(this.buildListArgs(args));
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = AdvisoryRepository;
