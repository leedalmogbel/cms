const { Operation } = require('@brewery/core');
const Category = require('src/domain/Category');

class ShowCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute({ where: { id } }) {
    try {
      const category = await this.CategoryRepository.getById(id);
      return category;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ShowCategory;
