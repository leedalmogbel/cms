const { Operation } = require('../../infra/core/core');

class RemoveAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(args) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    const advisoryIds = args.id;


    let entity;
    let valid = true;
    let message;

    if (typeof advisoryIds === 'number') {
      try {
        await this.AdvisoryRepository.getById(advisoryIds);
      } catch (error) {
        error.message = 'Advisory not found';
        return this.emit(NOT_FOUND, error);
      }

      try {
        entity = await this.AdvisoryRepository.getAttachedPost(advisoryIds);

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

      await this.AdvisoryRepository.moveToBin(advisoryIds, entity.result);
    }

    if (Array.isArray(advisoryIds)) {
      advisoryIds.map(async (id) => {
        try {
          await this.AdvisoryRepository.getById(id);
        } catch (error) {
          this.emit(
            NOT_FOUND,
            new Error('Advisory not found'),
          );
        }

        try {
          entity = await this.AdvisoryRepository.getAttachedPosts(id);

          if (entity.published.length) {
            this.emit(
              VALIDATION_ERROR,
              new Error('Advisory is attached to a published post'),
            );
          }
        } catch (error) {
          this.emit(VALIDATION_ERROR, error);
        }

        await this.AdvisoryRepository.moveToRecyleBin(id, entity.results);
      });
    }

    try {
      this.emit(SUCCESS, {
        results: { advisoryIds },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RemoveAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RemoveAdvisory;
