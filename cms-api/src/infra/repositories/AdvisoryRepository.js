
const Sequelized = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelized;

class AdvisoryRepository extends BaseRepository {
  constructor({ AdvisoryModel, UserModel }) {
    super(AdvisoryModel);

    this.UserModel = UserModel;
  }

  buildListArgs(data) {
    // init fetch arguments
    const args = {
      where: {
        status: {
          [Op.and]: [
            { [Op.ne]: 'draft' },
          ],
        },
        isActive: 1,
      },
      limit: 20,
    };

    const order = [['updatedAt', 'DESC']]; // set order by default descending

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

    if ('status' in data) {
      args.where.status = data.status;
    }

    // offset
    if ('offset' in args) {
      args.offset = Number(data.offset);
    }

    // limit
    if ('limit' in args) {
      args.limit = Number(data.limit);
    }

    // order
    args.order = order;

    return args;
  }

  getAdvisories(args) {
    return this.getAll({
      ...this.buildListArgs(args),
      include: [
        {
          model: this.UserModel,
          as: 'user',
          attributes: [
            'id',
            'firstname',
            'lastname',
          ],
        },
      ],
    });
  }

  getAdvisoryById(id) {
    return this.model.findOne({
      where: {
        id,
      },
      include: [
        {
          model: this.UserModel,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = AdvisoryRepository;
