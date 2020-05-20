const Sequelize = require('sequelize');
const moment = require('moment');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostRepository extends BaseRepository {
  constructor({
    PostModel, UserModel, RecycleBinModel, PostTagModel, PostAdvisoryRepository, PostAdvisoryModel,
  }) {
    super(PostModel);

    this.UserModel = UserModel;
    this.RecycleBinModel = RecycleBinModel;
    this.PostTagModel = PostTagModel;
    this.PostAdvisoryRepository = PostAdvisoryRepository;
    this.PostAdvisoryModel = PostAdvisoryModel;
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

    if ('location' in data && data.location) {
      const loc = data.location;
      const extractCall = Sequelize.fn('JSON_EXTRACT', Sequelize.col('locations'), `$.${loc}`);
      const unquoteCall = Sequelize.fn('JSON_UNQUOTE', extractCall);
      const functionalWhere = Sequelize.where(Sequelize.fn('LOWER', unquoteCall), loc.toLowerCase());

      // args.where[Op.and] = Sequelize.where(
      //   Sequelize.literal('json_extract(locations, \'$.address\')'),
      //   {
      //     [Op.like]: `%${data.location.toLowerCase()}%`,
      //   },
      // );
      args.where[Op.and] = Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('locations')),
        {
          [Op.like]: `%${data.location.toLowerCase()}%`,
        },
      );
      // const sample = {
      //   [Op.and]: {
      //     'locations.address': {
      //       [Op.like]: `%${data.location.toLowerCase()}%`,
      //     },
      //   },
      // };
      // args.where[Op.and] = Sequelize.fn('JSON_CONTAINS', Sequelize.col('locations'), Sequelize.cast(`{"address":"%${data.location}%"}`, 'CHAR CHARACTER SET utf8'));
      // args.where[Op.and] = {
      //   [Op.col]: 'locations.address',
      //   [Op.like]: `%${data.location.toLowerCase()}%`,
      // };
    }

    if ('category' in data) {
      args.where.category = data.category;
    }

    // set date
    if ('date' in data && data.date) {
      const date = new Date(data.date);
      const startDate = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const endDate = new Date(date.setHours(24, 0, 0, 0)).toISOString();

      // default filter
      args.where.updatedAt = {
        [Op.between]: [
          startDate,
          endDate,
        ],
      };
    }

    if ('status' in data) {
      args.where.status = data.status;

      if (data.status === 'published') {
        order = [['publishedAt', 'DESC']];
      }

      if (data.status === 'scheduled') {
        order = [['scheduledAt', 'ASC']];
      }

      if (data.status === 'embargo') {
        order = [['updatedAt', 'DESC']];
      }
    }

    if ('source' in data) {
      args.where.source = data.source;
    }

    if ('priorityLevel' in data) {
      args.where.priorityLevel = data.priorityLevel;
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
      logging: true,
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

  getByGeneratedPostId(postId) {
    return this.model.findOne({
      where: {
        postId,
      },
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
        meta: entity,
      }, { transaction });

      await entity.destroy(id, { transaction });

      await transaction.commit();

      return post;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async deletePostAdvisory(postId) {
    const postAdvisories = await this.PostAdvisoryRepository.getPostAdvisories(postId);

    postAdvisories.map(async (pAdv) => {
      await this.PostAdvisoryModel.destroy({
        where: {
          id: pAdv.id,
        },
      });
    });
  }
}

module.exports = PostRepository;
