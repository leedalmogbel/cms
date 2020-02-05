
const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostRepository extends BaseRepository {
  constructor({ PostModel, UserModel, RecycleBinModel }) {
    super(PostModel);

    this.UserModel = UserModel;
    this.RecycleBinModel = RecycleBinModel;
  }

  buildListArgs(data = {}) {
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

    let order = [['updatedAt', 'DESC']];

    // set keyword
    if ('keyword' in data
      && data.keyword) {
      args.where[Op.or] = {
        title: {
          [Op.like]:
            `%${data.keyword}%`,
        },
        content: {
          [Op.like]:
            `%${data.keyword}%`,
        },
      };
    }

    // set location
    if ('location' in data) {
      if (data.location) {
        args.where.locationAddress = {
          [Op.like]:
            `%${data.location}%`,
        };
      }
    }

    if ('category' in data) {
      args.where.category = data.category;
    }

    // set date
    if ('date' in data && data.date) {
      const date = new Date(data.date);
      const startDate = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const endDate = new Date(date.setHours(24, 0, 0, 0)).toISOString();

      if ('status' in data && data.status === 'scheduled') {
        args.where.scheduledAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      } else if ('status' in data && data.status === 'published') {
        args.where.publishedAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      } else {
        // default filter
        args.where.updatedAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      }
    }

    if ('status' in data) {
      args.where.status = data.status;

      if (data.status === 'published') {
        order = [['publishedAt', 'DESC']];
      }

      if (data.status === 'scheduled') {
        order = [['scheduledAt', 'ASC']];
      }
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

  getPosts(args) {
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

  getPostById(id) {
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

  async moveToBin(id) {
    const entity = await this._getById(id);
    const transaction = await this.model.sequelize.transaction();

    try {
      const post = await this.RecycleBinModel.create({
        userId: entity.userId,
        type: 'post',
        meta: entity
      }, { transaction });

      await entity.destroy(id, { transaction });

      await transaction.commit();

      return post;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }
}

module.exports = PostRepository;
