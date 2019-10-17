const { Operation } = require('@brewery/core');

class ListCategories extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute(args) {
    try {
      // get categories
      const categories = await this.CategoryRepository.getAll(args);

      // return categories
      return categories;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = ListCategories;
    
