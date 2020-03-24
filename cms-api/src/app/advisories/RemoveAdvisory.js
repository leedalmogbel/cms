const { Operation } = require('../../infra/core/core');

class RemoveAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(ids) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let entity;
    let valid = true;
    let message;

    if (typeof ids === 'number') {
      try {
        await this.AdvisoryRepository.getById(ids);
      } catch (error) {
        error.message = 'Advisory not found';
        return this.emit(NOT_FOUND, error);
      }

      try {
        entity = await this.AdvisoryRepository.getAttachedPost(ids);

        if (entity.published.length) {
          return this.emit(
            VALIDATION_ERROR,
            new Error('Advisory is attached to a published post'),
          );
        }
      } catch (error) {
        error.message = 'Advisory is attached to a published post';
        return this.emit(VALIDATION_ERROR, error);
      }

      await this.AdvisoryRepository.moveToBin(ids, entity.result);
    } else {
      ids.forEach(async (id) => {
        try {
          await this.AdvisoryRepository.getById(id);
        } catch (error) {
          error.message = 'Advisory not found';
          return this.emit(NOT_FOUND, error);
        }
        try {
          entity = await this.AdvisoryRepository.getAttachedPosts(id);

          if (entity.published.length && entity.published.length) {
            message = 'Advisory is attached to a published post';
          } else {
            message = 'error';
            valid = false;
          }
        } catch (error) {
          return this.emit(VALIDATION_ERROR, error);
        }

        await this.AdvisoryRepository.moveToBin(id, entity.result);
      });
    }

    try {
      this.emit(SUCCESS, {
        results: { ids },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RemoveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RemoveAdvisory;
