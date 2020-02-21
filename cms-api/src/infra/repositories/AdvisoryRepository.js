const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class AdvisoryRepository extends BaseRepository {
  constructor({ AdvisoryModel, UserModel, RecycleBinModel, PostModel }) {
    super(AdvisoryModel);
    this.UserModel = UserModel;
    this.RecycleBinModel = RecycleBinModel;
    this.PostModel = PostModel;
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

    if ('category' in data && data.category) {
      const { category } = data;
      args.where.category = category;
    }

    if ('location' in data && data.location) {
      const { location } = data;
      args.where.locationAddress = {
        [Op.like]: `%${location}%`,
      };
    }

    if ('date' in data && data.date) {
      const date = new Date(data.date);
      const startDate = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const endDate = new Date(date.setHours(24, 0, 0, 0)).toISOString();

      args.where.updatedAt = {
        [Op.between]: [
          startDate,
          endDate,
        ],
      };
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

    if ('isAssigned' in data
      && data.isAssigned === 'true') {
      args.where.users = {
        [Op.ne]: null,
        [Op.not]: '[]',
        [Op.ne]: 'undefined',
      };
    } else if ('isAssigned' in data
     && data.isAssigned === 'false') {
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

  async moveToBin(id, posts) {
    const entity = await this._getById(id);
    const transaction = await this.model.sequelize.transaction();

    try {
      const advisory = await this.RecycleBinModel.create({
        userId: entity.userId,
        type: 'advisory',
        meta: entity,
      }, { transaction });

      await Promise.all(
        posts.map(async (post) => {
          await post.update({
            advisories: post.advisories.filter(advisory => advisory != id),
          }, { transaction });
        }),
      );

      await entity.destroy(id, { transaction });

      await transaction.commit();

      return advisory;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async getAttachedPost(id) {
    try {
      const entity = await this.PostModel.findAll({
        where:{ advisories : Sequelize.literal(' CONCAT(advisories) REGEXP "(' + id + ')"') }
      })

      return {
        published: entity.filter(post => post.status == 'published'),
        result: entity
      }
    } catch (error) {
      throw error;
    }
    
  }
}

module.exports = AdvisoryRepository;
