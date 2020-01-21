const Sequelize = require('sequelize');
const { BaseRepository } = require('../../infra/core/core');

const { Op } = Sequelize;

class CategoryRepository extends BaseRepository {
  constructor({ CategoryModel, PostModel }) {
    super(CategoryModel);
    this.PostModel = PostModel;
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    console.log('dataasdasdasdasdasd', data);
    const args = {
      where: {
        parent: data,
        isActive: 1,
      },
    };

    return args;
  }

  getCategoryById(id) {
    return this.model.findOne({
      where: {
        id,
      },
    });
  }

  getSubCategories(id) {
    return this.getAll({ ...this.buildListArgs(id) });
  }
}

module.exports = CategoryRepository;
