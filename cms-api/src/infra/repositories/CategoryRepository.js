
const { BaseRepository } = require('@brewery/core');

class CategoryRepository extends BaseRepository {
  constructor({ CategoryModel }) {
    super(CategoryModel);
  }
}

module.exports = CategoryRepository;

