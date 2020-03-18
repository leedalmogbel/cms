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

    let order = [['updatedAt', 'DESC']];

    // set keyword
    if ('keyword' in data
      && data.keyword) {
      if ('ids' in data) {
        args.where = {
          id: data.ids,
        };
      } else {
        data.keyword = data.keyword.toLowerCase();
        args.where = {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('title')),
              {
                [Op.like]: `%${data.keyword}%`,
              },
            ),
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('content')),
              {
                [Op.like]: `%${data.keyword}%`,
              },
            ),
          ],
        };
      }
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

    if ('order' in data) {
      // customized sorting via date
      order = [['publishedAt', data.order.publishedAt]];
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
