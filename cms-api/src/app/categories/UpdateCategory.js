const { Operation } = require('@brewery/core');

class UpdateCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute({ where: { id }, data }) {
    try {
      // validate Category
      await this.CategoryRepository.getById(id);
    } catch (error) {
      throw new Error('Category does not exists.');
    }

    // update category
    // return true as success response
    await this.CategoryRepository.update(id, data);
    return true;
  }
}

module.exports = UpdateCategory;
