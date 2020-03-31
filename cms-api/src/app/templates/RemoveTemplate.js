const { Operation } = require('../../infra/core/core');

class RemoveTemplate extends Operation {
  constructor({ TemplateRepository }) {
    super();
    this.TemplateRepository = TemplateRepository;
  }

  async execute(id) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.TemplateRepository.getById(id);
    } catch (error) {
      error.message = 'Template not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      await this.TemplateRepository.update(id, {
        isActive: 0,
      });

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RemoveTemplate.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RemoveTemplate;
