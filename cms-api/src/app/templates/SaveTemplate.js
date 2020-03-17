const Template = require('src/domain/Post');
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
  }
}

SaveTemplate.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveTemplate;
