const { Operation } = require('@brewery/core');


class PublishAdvisory extends Operation {
  constructor({ AdvisoryRepository, SaveAdvisory }) {
    super();
    this.SaveAdvisory = SaveAdvisory;
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(id, data = {}) {
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
      data.draft = false;
      data = await this.SaveAdvisory.build(data);
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.AdvisoryRepository.update(id, data);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

PublishAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishAdvisory;
