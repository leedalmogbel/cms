const { Operation } = require('../../infra/core/core');

class ShowCategory extends Operation {
  constructor({ CategoryRepository }) {
    super();
    this.CategoryRepository = CategoryRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const category = await this.CategoryRepository.getCategoryById(id);
      let subCategories = await this.CategoryRepository.getSubCategories(id);

      // parse sub categories
      subCategories = subCategories.map((cat) => {
        cat = {
          ...cat.toJSON(),
        };

        return cat;
      });

      this.emit(SUCCESS, {
        results: { category, subCategories },
        meta: {},
      });
    } catch (error) {
      error.message = 'Category not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

ShowCategory.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ShowCategory;
