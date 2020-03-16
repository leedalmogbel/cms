const Advisory = require('src/domain/Advisory');
const { Operation } = require('../../infra/core/core');

class CreateInitialAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute() {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      const advisory = new Advisory({
        status: 'initial',
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

CreateInitialAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateInitialAdvisory;
