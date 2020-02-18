const Category = require('src/domain/Category');
const { Operation } = require('../../infra/core/core');

class CreateCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      const payload = new Category(data);
      const category = await this.CategoryRepository.add(payload);

      this.emit(SUCCESS, {
        results: category,
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

CreateCategory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateCategory;
