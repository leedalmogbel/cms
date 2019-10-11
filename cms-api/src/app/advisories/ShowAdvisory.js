const { Operation } = require('@brewery/core');

class ShowAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({where : { id }}) {

    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const advisory = await this.AdvisoryRepository.getById(id);

      this.emit(SUCCESS, advisory);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

ShowAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ShowAdvisory;
    
