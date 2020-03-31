const { Operation } = require('../../infra/core/core');

class ListTemplates extends Operation {
  constructor({ TemplateRepository }) {
    super();
    this.TemplateRepository = TemplateRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const templates = await this.TemplateRepository.getTemplates(args);
      const total = await this.TemplateRepository.count(args);

      this.emit(SUCCESS, {
        results: templates,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListTemplates.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListTemplates;
