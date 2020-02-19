const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

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
            { [Op.ne]: 'initial' },
          ],
        },
        isActive: 1,
      },
      limit: 20,
    };

    const order = [['updatedAt', 'DESC']]; // set order by default descending

    // search for keyword
    if ('keyword' in data) {
      const { keyword } = data;

      args.where[Op.or] = [
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('title')),
          {
            [Op.like]: `%${keyword}%`,
          },
        ),
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('content')),
          {
            [Op.like]: `%${keyword}%`,
          },
        ),
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.json('tagsAdded')),
          {
            [Op.like]: `%${keyword}%`,
          },
        ),
      ];
    }

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
    if ('offset' in data) {
      args.offset = Number(data.offset);
    }

    // limit
    if ('limit' in data) {
      args.limit = Number(data.limit);
    }

    if ('assigned' in data) {
      args.where.users = {
        [Op.ne]: null,
        [Op.not]: '[]',
        [Op.ne]: 'undefined',
      };
    }

    if ('unassigned' in data) {
      args.where.users = {
        [Op.eq]: null,
      };
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
