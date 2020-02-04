const { Operation } = require('../../infra/core/core');

class SaveCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.CategoryRepository.getById(id);
    } catch (error) {
      error.message = 'Category not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      await this.CategoryRepository.update(id, data);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SaveCategory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveCategory;
