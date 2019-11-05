const { Operation } = require('@brewery/core');
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

    try {
      this.save(id, data);
      this.emit(SUCCESS, { id });
    } catch (error) {
      switch (error.message) {
        case 'ValidationError':
          return this.emit(VALIDATION_ERROR, error);
        case 'NotFoundError':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }

  async save(id, data) {
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

    const payload = new Advisory(data);
    await this.AdvisoryRepository.update(id, payload);

    return this.AdvisoryRepository.getById(id);
  }
}

SaveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveAdvisory;
