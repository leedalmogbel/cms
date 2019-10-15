
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
      if ('scheduled' in data.where && data.where.scheduled) {
        where.scheduled = {
          [Op.ne]: null
        };
      }

      // set published flag
      if ('published' in data.where && data.where.published) {
        where.published = {
          [Op.ne]: null
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

