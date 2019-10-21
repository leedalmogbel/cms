
const { BaseRepository } = require('@brewery/core');
const Sequelized = require('sequelize');
const Op = Sequelized.Op;

class AdvisoryRepository extends BaseRepository {
  constructor({ AdvisoryModel }) {
    super(AdvisoryModel);
  }

  async getAdvisories (data) {
    // init fetch arguments
    let args = {
      where: {
        draft: false // default draft false
      }
    };

    let order = [['createdAt', 'DESC']]; // set order by default descending

    // filters
    if ('where' in data) {
      // fetch verified
      if ('verified' in data.where) {
        if (data.where.verified) {
          args.where.verified = {
            [Op.eq]: true
          };
        } else {
          args.where.verified = {
            [Op.eq]: false
          };
        }
      }
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

