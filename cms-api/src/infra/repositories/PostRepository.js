
const { BaseRepository } = require('@brewery/core');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

class PostRepository extends BaseRepository {
  constructor({ PostModel }) {
    super(PostModel);
  }

  async getPosts(data = {}) {
    // init fetch arguments
    let args = {
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
