const Template = require('src/domain/Template');
const { Operation } = require('../../infra/core/core');

class CreateTemplate extends Operation {
  constructor({ TemplateRepository }) {
    super();
    this.TemplateRepository = TemplateRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      // remove modifiedBy if null
      const { modifiedBy } = data;
      if (!modifiedBy || modifiedBy === 'null') {
        delete data.modifiedBy;
      }
    
      const payload = new Template(data);
      const template = await this.TemplateRepository.add(payload);

      this.emit(SUCCESS, {
        results: template,
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

CreateTemplate.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateTemplate;
