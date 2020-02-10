const { Operation } = require('../../infra/core/core');

class Restore extends Operation {
  constructor({ RecycleBinRepository }) {
    super();
    this.RecycleBinRepository = RecycleBinRepository;
  }

  async execute(data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let posts;

    try {
      if(typeof data.id !== 'number') {
        posts = await Promise.all(data.id.map(async id => {
          return await this.RecycleBinRepository.getById(id);
        }));
      } else {
        posts = await this.RecycleBinRepository.getById(data.id);
      }
    } catch (error) {
      return this.emit(
        VALIDATION_ERROR,
        new Error('Post/s not found'),
      );
    }

    try {
      const ids = await this.RecycleBinRepository.restoreList(data.id, posts);

      this.emit(SUCCESS, ids);
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
}

Restore.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = Restore;
