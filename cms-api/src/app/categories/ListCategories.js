const { Operation } = require('@brewery/core');

class ListCategories extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute(args) {
    // get categories
    const categories = await this.CategoryRepository.getAll(args);
    return categories;
  }
}

module.exports = ListCategories;
