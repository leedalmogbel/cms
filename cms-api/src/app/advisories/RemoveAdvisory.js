const { Operation } = require('../../infra/core/core');

class RemovePost extends Operation {
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

    try {
      await this.AdvisoryRepository.moveToBin(id);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RemovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RemovePost;
