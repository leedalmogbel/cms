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
    httpClient,
  }) {
    super(PostModel);

    this.UserModel = UserModel;
    this.RecycleBinModel = RecycleBinModel;
    this.PostTagModel = PostTagModel;
    this.PostAdvisoryRepository = PostAdvisoryRepository;
    this.PostAdvisoryModel = PostAdvisoryModel;
    this.PostTagRepository = PostTagRepository;
    this.httpClient = httpClient;
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

    // filter multiple location
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

    // filter category
    if ('category' in data && Array.isArray(data.category) && data.category.length > 0) {
      args.where.categoryId = data.category;
    }

    // filter subcategory
    if ('subCategory' in data && Array.isArray(data.subCategory) && data.subCategory.length > 0) {
      args.where.subCategoryId = data.subCategory;
    }

    // filter writer
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

    // filter editor
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

    // filter created date
    if ('date' in data && data.date) {
      const { dateFrom, dateTo } = data.date;

      if (dateFrom && dateTo) {
        // NOTE: reference for future use
        /* const date = new Date(data.date);
        const startDate = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const endDate = new Date(date.setHours(24, 0, 0, 0)).toISOString(); */

        args.where.createdAt = {
          [Op.between]: [
            new Date(dateFrom).toISOString(),
            new Date(new Date(dateTo).setHours(24, 0, 0, 0)).toISOString(),
          ],
        };

        order = [['createdAt', 'DESC']];
      }
    }

    // filter published date
    if ('publishedDate' in data && data.publishedDate) {
      const { dateFrom, dateTo } = data.publishedDate;

      if (dateFrom && dateTo) {
        args.where.publishedAt = {
          [Op.between]: [
            new Date(dateFrom).toISOString(),
            new Date(new Date(dateTo).setHours(24, 0, 0, 0)).toISOString(),
          ],
        };

        order = [['publishedAt', 'DESC']];
      }
    }

    // filter modified date
    if ('modifiedDate' in data && data.modifiedDate) {
      const { dateFrom, dateTo } = data.modifiedDate;

      if (dateFrom && dateTo) {
        args.where.updatedAt = {
          [Op.between]: [
            new Date(dateFrom).toISOString(),
            new Date(new Date(dateTo).setHours(24, 0, 0, 0)).toISOString(),
          ],
        };

        order = [['updatedAt', 'DESC']];
      }
    }

    // filter recalled date
    if ('recalledDate' in data && data.recalledDate) {
      const { dateFrom, dateTo } = data.recalledDate;

      if (dateFrom && dateTo) {
        args.where.recalledAt = {
          [Op.between]: [
            new Date(dateFrom).toISOString(),
            new Date(new Date(dateTo).setHours(24, 0, 0, 0)).toISOString(),
          ],
        };

        order = [['recalledAt', 'DESC']];
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

  async getPostCategory(categoryId) {
    try {
      const { category } = await this.httpClient.get(`${process.env.PMS_LOOKUP_ENDPOINT}/category/${categoryId}`, {});
      return category.name;
    } catch (e) {
      throw new Error('Post category not found');
    }
  }

  async getPostSubCategory(subCategoryId) {
    try {
      const { subCategory } = await this.httpClient.get(`${process.env.PMS_LOOKUP_ENDPOINT}/subcategory/${subCategoryId}`, {});
      return subCategory.name;
    } catch (e) {
      throw new Error('Post subcategory not found');
    }
  }
}

module.exports = PostRepository;
