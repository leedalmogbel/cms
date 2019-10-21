
const { BaseRepository } = require('@brewery/core');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class PostRepository extends BaseRepository {
  constructor({ PostModel }) {
    super(PostModel);
  }

  async getPosts(data) {
    // init fetch arguments
    let args = {
      where: {
        draft: false // default draft false
      }
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
            [Op.ne]: null
          };
        } else {
          where.scheduledAt = {
            [Op.eq]: null
          }
        }
      }

      // set published flag
      if ('published' in data) {
        if (data.where.published) {
          args.where.publishedAt = {
            [Op.ne]: null
          }
        } else {
          where.publishedAt = {
            [Op.eq]: null
          }
        }
      }
    }

    // offset
    if ('offset' in args) {
      args.offset = args.offset;
    }

    // limit
    if ('limit' in args) {
      args.limit = args.limit;
    }

    return this.getAll(args);
  }
}

module.exports = PostRepository;

