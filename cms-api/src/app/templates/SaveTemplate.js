const { Operation } = require('../../infra/core/core');

class SaveTemplate extends Operation {
  constructor({ TemplateRepository }) {
    super();
    this.TemplateRepository = TemplateRepository;
  }

  async execute(id, data) {
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
      // remove modifiedBy if null
      const { modifiedBy } = data;
      if (!modifiedBy || modifiedBy === 'null') {
        delete data.modifiedBy;
      }

      await this.TemplateRepository.update(id, data);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SaveTemplate.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveTemplate;
