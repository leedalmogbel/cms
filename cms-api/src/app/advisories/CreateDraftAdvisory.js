const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class CreateDraftAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute() {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      // build data
      const advisory = new Advisory({
        draft: true,
      });

      const { id } = await this.AdvisoryRepository.add(advisory);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

CreateDraftAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateDraftAdvisory;
