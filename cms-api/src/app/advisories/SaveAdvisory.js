const Advisory = require('src/domain/Advisory');
const { Operation } = require('../../infra/core/core');

class SaveAdvisory extends Operation {
  constructor({ AdvisoryRepository, BaseLocation }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.BaseLocation = BaseLocation;
  }

  async execute(id, data = {}) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    const payload = await this.build(data);

    try {
      await this.AdvisoryRepository.getById(id);
    } catch (error) {
      error.message = 'Advisory not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      payload.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.AdvisoryRepository.update(id, payload);
      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async build(data) {
    if ('placeId' in data) {
      const loc = await this.BaseLocation.detail(data.placeId);

      data = {
        ...data,
        locationDetails: loc,
        locationAddress: loc.address,
      };
    }

    return new Advisory(data);
  }
}

SaveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveAdvisory;
