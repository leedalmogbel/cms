const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class CreateAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
    const advisory = new Advisory(data);
    
    try {
      const newAdvisory = await this.AdvisoryRepository.add(advisory.toJSON());
  
      this.emit(SUCCESS, newAdvisory);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
  
      this.emit(ERROR, error);
    }

    this.emit(SUCCESS, { dog: 1});
  }
}

CreateAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateAdvisory;
