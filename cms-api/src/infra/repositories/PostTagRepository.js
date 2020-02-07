const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class PostTagRepository extends BaseRepository {
  constructor({ PostTagModel }) {
    super(PostTagModel);
  }

  getTagByName(name) {
    return this.model.findOne({
      where: {
        name,
      },
    });
  }

  getPostIdByTagName(name) {
    return this.model.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }
}

module.exports = PostTagRepository;
