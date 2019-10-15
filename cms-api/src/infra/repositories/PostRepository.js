
const { BaseRepository } = require('@brewery/core');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class PostRepository extends BaseRepository {
  constructor({ PostModel }) {
    super(PostModel);
  }

  async getPosts(args) {
    // init filters
    let filters = {};

    // where arguments
    if ('where' in args) {
      // set scheduled flag
      if ('scheduled' in args.where && args.where.scheduled) {
        filters.scheduled = {
          [Op.ne]: null
        };
      }

      // set published flag
      if ('published' in args.where && args.where.published) {
        filters.published = {
          [Op.ne]: null
        }
      }
    }

    // fetch arguments
    const fetchArgs = {
      where: filters
    };

    return this.getAll(fetchArgs);
  }
}

module.exports = PostRepository;

