const Sequelize = require('sequelize');
const moment = require('moment');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostRepository extends BaseRepository {
  constructor({
    PostModel,
    UserModel,
    RecycleBinModel,
    PostTagModel,
    PostAdvisoryModel,
    PostAdvisoryRepository,
    PostTagRepository,
  }) {
    super(PostModel);

    this.UserModel = UserModel;
    this.RecycleBinModel = RecycleBinModel;
    this.PostTagModel = PostTagModel;
    this.PostAdvisoryRepository = PostAdvisoryRepository;
    this.PostAdvisoryModel = PostAdvisoryModel;
    this.PostTagRepository = PostTagRepository;
  }

  async buildListArgs(data = {}) {
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

    // filter multiple keyword
    if ('keyword' in data && Array.isArray(data.keyword) && data.keyword.length > 0) {
      let keywordArgs = [];

      await Promise.all(
        data.keyword.map(async (key) => {
          key = key.toLowerCase();
  
          // filter by tags
          const postTags = await this.PostTagRepository.filterPostTagsByName(key);
          const postTagIds = postTags.map((pTags) => pTags.postId);

          keywordArgs = [
            ...keywordArgs,
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', `%${key}%`),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('content')), 'LIKE', `%${key}%`),
            {
              id: postTagIds,
            },
          ];
        }),
      );

      args.where = {
        ...args.where,
        [Op.and]: [{
          [Op.or]: keywordArgs,
        }],
      };
    }

    if ('location' in data && Array.isArray(data.location) && data.location.length > 0) {
      let locArgs = [];

      await Promise.all(
        data.location.map(async (loc) => {
          locArgs = [
            ...locArgs,
            Sequelize.where(
              Sequelize.literal('LOWER(JSON_EXTRACT(locations, \'$[*].address\'))'),
              {
                [Op.like]: `%${loc.toLowerCase()}%`,
              },
            ),
          ];
        }),
      );

      args.where = {
        ...args.where,
        [Op.and]: [
          ...args.where[Op.and] ? args.where[Op.and] : [],
          [{
            [Op.or]: locArgs,
          }],
        ],
      };
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

    if ('writer' in data) {
      args.where = {
        ...args.where,
        [Op.and]: [
          ...args.where[Op.and] ? args.where[Op.and] : [],
          [{
            [Op.and]: Sequelize.where(
              Sequelize.literal('contributors->"$.writers[0].id"'),
              {
                [Op.eq]: Number(data.writer),
              },
            ),
          }],
        ],
      };
    }

    if ('editor' in data) {
      args.where = {
        ...args.where,
        [Op.and]: [
          ...args.where[Op.and] ? args.where[Op.and] : [],
          [{
            [Op.and]: Sequelize.where(
              Sequelize.literal('contributors->"$.editor.id"'),
              {
                [Op.eq]: Number(data.editor),
              },
            ),
          }],
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

  async getPosts(args) {
    args = await this.buildListArgs(args);

    return this.getAll({
      ...args,
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

  async count(args) {
    args = await this.buildListArgs(args);
    return this.model.count(args);
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
