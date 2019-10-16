const { Operation } = require('@brewery/core');

class DeleteCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute({ where: {id} }) {
    try {
      // validate category
      await this.CategoryRepository.getById(id);
    } catch (error) {
      throw new Error('Category does not exists.');
    }

    try {
      // delete category
      await this.CategoryRepository.remove(id);

      // return true as success response
      return true;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DeleteCategory;
