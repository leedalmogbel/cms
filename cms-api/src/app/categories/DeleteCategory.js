const { Operation } = require('@brewery/core');

class DeleteCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute({ where: { id } }) {
    try {
      // validate category
      await this.CategoryRepository.getById(id);
    } catch (error) {
      throw new Error('Category does not exists.');
    }

    // delete category
    // return true as success response
    await this.CategoryRepository.remove(id);
    return true;
  }
}

module.exports = DeleteCategory;
