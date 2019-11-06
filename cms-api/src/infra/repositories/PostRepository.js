
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

    // set draft
    if ('draft' in data) {
      args.where.draft = data.draft;
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
              `%${data.locationAddress}%`,
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

        args.where.createdAt = {
          [Op.between]: [
            startDate,
            endDate,
          ],
        };
      }
    }

    // set scheduled flag
    if ('scheduled' in data) {
      if (data.scheduled) {
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
    if ('published' in data) {
      if (data.published) {
        args.where.publishedAt = {
          [Op.ne]: null,
        };
      } else {
        args.where.publishedAt = {
          [Op.eq]: null,
        };
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
