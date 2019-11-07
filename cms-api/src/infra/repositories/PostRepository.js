
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

    // set order by default on
    // publisched descending and scheduled ascending
    let order = [['scheduledAt', 'ASC'], ['publishedAt', 'DESC']];

    // set draft
    if ('draft' in data) {
      args.where.draft = (data.draft === 'true') ? 1 : 0;
    }

    // set keyword
    if ('keyword' in data) {
      if (data.keyword) {
        args.where.title = {
          [Op.like]:
              `%${data.title}%`,
        };
      }
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

    // set published flag
    if ('published' in data) {
      if (data.published) {
        args.where.publishedAt = {
          [Op.ne]: null,
        };
      }
      order = [['publishedAt', 'DESC']];
    }

    // set scheduled flag
    if ('scheduled' in data) {
      if (data.scheduled) {
        args.where.scheduledAt = {
          [Op.ne]: null,
        };
        args.where.publishedAt = {
          [Op.eq]: null,
        };
      }
      order = [['scheduledAt', 'DESC']]; // set order by default descending
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

        args.where.publishedAt = {
          [Op.or]: {
            [Op.between]: [
              startDate,
              endDate,
            ],
            [Op.eq]: null,
          },
        };

        if ('scheduled' in data) {
          args.where.scheduledAt = {
            [Op.between]: [
              startDate,
              endDate,
            ],
          };
        }
      }

      order = [['publishedAt', 'DESC']];
    }

    // offset
    if ('offset' in data) {
      args.offset = Number(data.offset);
    }

    // limit
    if ('limit' in data) {
      args.limit = Number(data.limit);
    }

    args.order = order;

    return this.getAll(args);
  }
}

module.exports = PostRepository;
