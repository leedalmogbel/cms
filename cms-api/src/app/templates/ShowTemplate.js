const { Operation } = require('../../infra/core/core');

class ShowTemplate extends Operation {
  constructor({ TemplateRepository }) {
    super();
    this.TemplateRepository = TemplateRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const post = await this.TemplateRepository.getById(id);

      this.emit(SUCCESS, {
        results: post,
        meta: {},
      });
    } catch (error) {
      error.message = 'Template not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

ShowTemplate.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ShowTemplate;
