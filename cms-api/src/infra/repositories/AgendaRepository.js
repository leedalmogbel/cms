
const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class AgendaRepository extends BaseRepository {
  constructor({ AgendaModel, UserModel }) {
    super(AgendaModel);
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

  getAgendas(args) {
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

  getAgendaById(id) {
    return this.model.findOne({
      where: {
        id,
        isActive: 1,
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

module.exports = AgendaRepository;
