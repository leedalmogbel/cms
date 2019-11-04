
const { BaseRepository } = require('@brewery/core');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

class PostRepository extends BaseRepository {
  constructor({ PostModel }) {
    super(PostModel);
  }

  async getPosts(data = {}) {
    // init fetch arguments
    const args = {
      where: {
        draft: false, // default draft false
      },
    };

    // where arguments
    if ('where' in data) {
      // set draft
      if ('draft' in data.where) {
        args.where.draft = data.where.draft;
      }

      // set keyword
      if ('keyword' in data.where) {
        if (data.where.keyword) {
          args.where.title = {
            [Op.like]:
              `%${data.where.title}%`,
          };
        }
      }

      // set location
      if ('location' in data.where) {
        if (data.where.location) {
          args.where.locationAddress = {
            [Op.like]:
              `%${data.where.locationAddress}%`,
          };
        }
      }

      if ('category' in data.where) {
        args.where.category = data.where.category;
      }

      // set date
      if ('date' in data.where) {
        if (data.where.date) {
          const d = data.where.date;
          const newDate = d.split(' ');
          newDate[1] = '00:00:00';
          const startDate = newDate.join(' ');
          newDate[1] = '23:59:59';
          const endDate = newDate.join(' ');

          args.where.createdAt = {
            [Op.between]: [
              startDate,
              endDate,
            ],
          };
        }
      }

      // set scheduled flag
      if ('scheduled' in data.where) {
        if (data.where.scheduled) {
          args.where.scheduledAt = {
            [Op.ne]: null,
          };
        } else {
          args.where.scheduledAt = {
            [Op.eq]: null,
          };
        }
      }

      // set published flag
      if ('published' in data.where) {
        if (data.where.published) {
          args.where.publishedAt = {
            [Op.ne]: null,
          };
        } else {
          args.where.publishedAt = {
            [Op.eq]: null,
          };
        }
      }
    }

    // offset
    if ('offset' in data) {
      args.offset = data.offset;
    }

    // limit
    if ('limit' in data) {
      args.limit = data.limit;
    }

    return this.getAll(args);
  }
}

module.exports = PostRepository;
