
const { BaseRepository } = require('@brewery/core');
const Sequelized = require('sequelize');
const Op = Sequelized.Op;

class AdvisoryRepository extends BaseRepository {
  constructor({ AdvisoryModel }) {
    super(AdvisoryModel);
  }

  async getAdvisories (data) {
    let args = {};
    let order = [['createdAt', 'DESC']]; // set order by default descending

    if ('where' in data) {
      let where = {};

      // fetch verified
      if ('verified' in data.where) {
        if (data.where.verified) {
          where.verified = {
            [Op.eq]: true
          };
        } else {
          where.verified = {
            [Op.eq]: false
          };
        }
      }

      // filters
      args.where = where;
    }

    // offset
    if ('offset' in args) {
      args.offset = args.offset;
    }

    // limit
    if ('limit' in args) {
      args.limit = args.limit;
    }

    // order
    args.order = order;

    return this.getAll(args);
  }
}

module.exports = AdvisoryRepository;

