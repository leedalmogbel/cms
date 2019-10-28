const { Operation } = require('@brewery/core');
const Category = require('src/domain/Category');

class CreateCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute({ data }) {
    // create new category
    const category = new Category(data);
    const newCategory = await this.CategoryRepository.add(category);

    return newCategory;
  }
}

module.exports = CreateCategory;
