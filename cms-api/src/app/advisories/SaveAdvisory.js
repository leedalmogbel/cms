const { Operation } = require('../../infra/core/core');
const Advisory = require('src/domain/Advisory');

class SaveAdvisory extends Operation {
  constructor({ AdvisoryRepository, GetLocation }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.GetLocation = GetLocation;
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
      const {
        locationDetails,
        locationAddress,
      } = await this.GetLocation.execute(data.placeId);

      data = {
        ...data,
        locationDetails,
        locationAddress,
      };
    }

    return new Advisory(data);
  }
}

SaveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveAdvisory;
