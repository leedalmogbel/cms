
const { BaseRepository } = require('@brewery/core');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

class PostRepository extends BaseRepository {
  constructor({ PostModel, UserModel }) {
    super(PostModel);

    this.UserModel = UserModel;
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {
      where: {
        status: {
          [Op.ne]: 'draft',
        },
      },
    };

    // set order by default on
    // publisched descending and scheduled ascending
    let order = [['publishedAt', 'DESC'], ['createdAt', 'DESC'], ['scheduledAt', 'ASC']];

    // set keyword
    if ('keyword' in data
      && data.keyword) {
      args.where = {
        [Op.or]: {
          title: {
            [Op.like]:
            `%${data.keyword}%`,
          },
          content: {
            [Op.like]:
            `%${data.keyword}%`,
          },
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
    if ('date' in data) {
      if (data.date) {
        const d = data.date;
        const newDate = d.split(' ');
        newDate[1] = '00:00:00';
        const startDate = newDate.join(' ');
        newDate[1] = '23:59:59';
        const endDate = newDate.join(' ');

        if ('scheduled' in data) {
          args.where.scheduledAt = {
            [Op.between]: [
              startDate,
              endDate,
            ],
          };
        } else if ('published' in data) {
          args.where.publishedAt = {
            [Op.or]: {
              [Op.between]: [
                startDate,
                endDate,
              ],
              // [Op.eq]: null,
            },
          };
        } else if ('all' in data) {
          args.where = {
            [Op.or]: {
              publishedAt: {
                [Op.between]: [
                  startDate,
                  endDate,
                ],
              },
              scheduledAt: {
                [Op.between]: [
                  startDate,
                  endDate,
                ],
              },
            },
          };
        }
      }

      order = [['publishedAt', 'DESC']];
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
        },
      ],
    });
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = PostRepository;
