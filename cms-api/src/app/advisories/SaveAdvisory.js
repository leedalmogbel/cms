const Advisory = require('src/domain/Advisory');
const { Operation } = require('../../infra/core/core');

class SaveAdvisory extends Operation {
  constructor({ AdvisoryRepository, BaseLocation, AdvisoryUserRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.BaseLocation = BaseLocation;
    this.AdvisoryUserRepository = AdvisoryUserRepository;
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

    if ('users' in data) {
      data = {
        ...data,
        taggedUsers: data.users,
      };

      await data.users.forEach((user) => {
        this.saveAdvisoryUsers({
          advisoryId: data.id,
          userId: user.id,
        });
      });
    }


    return new Advisory(data);
  }

  async saveAdvisoryUsers({ advisoryId, userId }) {
    const exists = await this.AdvisoryUserRepository.getAdvisoryUserById(advisoryId, userId);

    if (!exists) {
      await this.AdvisoryUserRepository.add({
        advisoryId,
        userId,
      });
    }
  }
}

SaveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveAdvisory;
