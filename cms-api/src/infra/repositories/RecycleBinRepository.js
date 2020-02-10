
const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class RecycleBinRepository extends BaseRepository {
  constructor({ RecycleBinModel, UserModel, PostModel }) {
    super(RecycleBinModel);

    this.UserModel = UserModel;
    this.PostModel = PostModel;
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {
      where: {
        meta: {
          status: {
            [Op.and]: [
              { [Op.ne]: 'initial' },
            ],
          },
          isActive: 1
        }
      },
      limit: 20,
    };

    let order = [['updatedAt', 'DESC']];

    if ('type' in data && data.type) {
      args.where.type = data.type;
    }

    // set keyword
    if ('keyword' in data
      && data.keyword) {
      args.where[Op.or] = {
        "meta.title": {
          [Op.like]:
            `%${data.keyword}%`,
        },
        "meta.content": {
          [Op.like]:
            `%${data.keyword}%`,
        },
        "meta.tagsAdded": {
          [Op.like]:`%${data.keyword}%`,
        },
        "meta.tagsRetained": {
          [Op.like]:`%${data.keyword}%`,
        },
      };
    }

    // set location
    if ('location' in data) {
      if (data.location) {
        args.where.meta.locationAddress = {
          [Op.like]:
            `%${data.location}%`,
        };
      }
    }

    if ('category' in data) {
      args.where.meta.category = data.category;
    }

    // set date
    if ('date' in data && data.date) {
      const date = new Date(data.date);
      const startDate = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const endDate = new Date(date.setHours(24, 0, 0, 0)).toISOString();

      if ('status' in data && data.status === 'scheduled') {
        args.where.meta.scheduledAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      } else if ('status' in data && data.status === 'published') {
        args.where.meta.publishedAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      } else {
        // default filter
        args.where.meta.updatedAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      }
    }

    if ('status' in data) {
      args.where.meta.status = data.status;

      if (data.status === 'published') {
        order = [['meta.publishedAt', 'DESC']];
      }

      if (data.status === 'scheduled') {
        order = [['meta.scheduledAt', 'ASC']];
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

  getList(args) {
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

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }

  async restoreList(ids) {
    const transaction = await this.model.sequelize.transaction();
    const posts = {};

    try {
      if(typeof ids !== 'number') {
        await Promise.all(ids.map(async id => this.restore(id, transaction)));
      } else {
        await this.restore(ids, transaction);
      }

      posts.id = ids;

      await transaction.commit();

      return posts;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async restore(id, transaction) {
    const entity = await this._getById(id);
    await entity.destroy(id, { transaction });

    if('post' == entity.type) {
      await this.PostModel.create({
        ...entity.meta
      }, { transaction });
    } else {
      // advisory
    }

    return entity.meta;
  }
}

module.exports = RecycleBinRepository;
