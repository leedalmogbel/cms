const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class TemplateRepository extends BaseRepository {
  constructor({ TemplateModel, UserModel }) {
    super(TemplateModel);

    this.UserModel = UserModel;
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
    if ('keyword' in data && data.keyword) {
      args.where[Op.or] = [
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('title')),
          {
            [Op.like]: `%${data.keyword.toLowerCase()}%`,
          },
        ),
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('content')),
          {
            [Op.like]: `%${data.keyword.toLowerCase()}%`,
          },
        ),
      ];
    }

    if ('ids' in data) {
      args.where.id = data.ids;
    }

    // set location
    if ('location' in data && data.location) {
      args.where[Op.and] = Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('locations')),
        {
          [Op.like]: `%${data.location.toLowerCase()}%`,
        },
      );
    }

    if ('category' in data) {
      args.where.category = data.category;
    }

    // offset
    if ('offset' in data) {
      args.offset = Number(data.offset);
    }

    // limit
    if ('limit' in data) {
      args.limit = Number(data.limit);
    }

    args.order = order;

    return args;
  }

  getTemplates(args) {
    return this.getAll({
      ...this.buildListArgs(args),
      include: [
        {
          model: this.UserModel,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: this.UserModel,
          as: 'userModified',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
  }

  getTemplateById(id) {
    return this.model.findOne({
      where: {
        id,
        isActive: 1,
      }
    });
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = TemplateRepository;
