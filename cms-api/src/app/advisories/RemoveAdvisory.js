const { Operation } = require('../../infra/core/core');

class RemoveAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(id) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.AdvisoryRepository.getById(id);
    } catch (error) {
      error.message = 'Advisory not found';
      return this.emit(NOT_FOUND, error);
    }

    let entity;

    try {
      entity = await this.AdvisoryRepository.getAttachedPost(id);

      if(entity.published.length) {
        console.log('ERROR DAPAT')
        return this.emit(
          VALIDATION_ERROR, 
          new Error('Advisory is attached to a published post'),
        );
      }
    } catch (error) {
      error.message = 'Advisory is attached to a published post';
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.AdvisoryRepository.moveToBin(id, entity.result);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RemoveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RemoveAdvisory;
