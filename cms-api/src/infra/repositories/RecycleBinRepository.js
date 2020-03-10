
const Sequelize = require('sequelize');
const moment = require('moment');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class RecycleBinRepository extends BaseRepository {
  constructor({
    RecycleBinModel, UserModel, PostModel, PostUtils, PostTagRepository,
  }) {
    super(RecycleBinModel);

    this.UserModel = UserModel;
    this.PostModel = PostModel;
    this.PostUtils = PostUtils;
    this.PostTagRepository = PostTagRepository;
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
          isActive: 1,
        },
      },
      limit: 20,
    };

    let order = [['updatedAt', 'DESC']];

    // set keyword
    if ('keyword' in data
      && data.keyword) {
      data.keyword = data.keyword.toLowerCase();
      args.where = {
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.json('meta.title')),
            {
              [Op.like]: `%${data.keyword}%`,
            },
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.json('meta.content')),
            {
              [Op.like]: `%${data.keyword}%`,
            },
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.json('meta.tagsAdded')),
            {
              [Op.like]: `%${data.keyword}%`,
            },
          ),
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.json('meta.tagsRetained')),
            {
              [Op.like]: `%${data.keyword}%`,
            },
          ),
        ],
      };
    }

    if ('category' in data) {
      args.where.meta = { category: data.category };
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

    if ('type' in data && data.type) {
      args.where = {
        ...args.where,
        [Op.and]: [
          { type: data.type },
        ],
      };
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

  async restoreList(ids, posts) {
    const transaction = await this.model.sequelize.transaction();

    try {
      if (typeof ids !== 'number') {
        await Promise.all(posts.map(async (post) => this.restore(post, transaction)));
      } else {
        await this.restore(posts, transaction);
      }

      await transaction.commit();

      return { id: ids };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async restore(post, transaction) {
    await post.destroy(post.id, { transaction });

    post.meta.status = 'draft';
    post.meta.isLocked = false;
    post.meta.lockUser = null;
    post.meta.expiredAt = null;

    // if (post.meta.publishedAt !== null) {
    //   post.meta.publishedAt = moment(post.meta.publishedAt).utc().format('YYYY-MM-DD HH:mm:ss');
    // }

    if (post.type === 'post') {
      await this.PostModel.create({
        ...post.meta,
      }, { transaction });

      await this.buildTags(post.meta);
    }
    // else {
    //  // advisory
    // }

    return post.meta;
  }

  async buildTags(data) {
    if ('tagsAdded' in data && data.tagsAdded) {
      await data.tagsAdded.forEach((tag) => {
        this.PostUtils.savePostTags({
          postId: data.id,
          name: tag,
        });
      });
    }

    if ('tagsRetained' in data && data.tagsRetained) {
      await data.tagsRetained.forEach((tag) => {
        this.PostUtils.savePostTags({
          postId: data.id,
          name: tag[0],
        });
      });
    }

    if ('tagsOriginal' in data && data.tagsOriginal) {
      await data.tagsOriginal.forEach(async (tag) => {
        let postTagId = await this.PostTagRepository.getPostIdByTagName(tag[0]);

        if (postTagId) {
          postTagId = postTagId.toJSON();
          await this.PostTagRepository.deletePostTagById(postTagId.id);
        }
      });
    }
  }

  async destroyList(posts) {
    const transaction = await this.model.sequelize.transaction();
    const id = [];
    try {
      await Promise.all(posts.map(async (post) => {
        await post.destroy({ transaction });
        id.push(post.id);
      }));

      await transaction.commit();

      return id;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}

module.exports = RecycleBinRepository;
