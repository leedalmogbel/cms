
const { BaseRepository } = require('@brewery/core');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class PostRepository extends BaseRepository {
  constructor({ PostModel }) {
    super(PostModel);
  }

  async getPosts(data) {
    // init fetch arguments
    let args = {};

    // where arguments
    if ('where' in data) {
      let where = {};

      // set scheduled flag
      if ('scheduled' in data.where) {
        if (data.where.scheduled) {
          where.scheduled = {
            [Op.ne]: null
          };
        } else {
          where.scheduled = {
            [Op.eq]: null
          }
        }
      }

      // set published flag
      if ('published' in data) {
        if (data.where.published) {
          where.published = {
            [Op.ne]: null
          }
        } else {
          where.published = {
            [Op.eq]: null
          }
        }
      }

      // set filters
      args.where = where;
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

