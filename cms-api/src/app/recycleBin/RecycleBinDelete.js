const { Operation } = require('../../infra/core/core');

class RecycleBinDelete extends Operation {
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
        posts = [ await this.RecycleBinRepository.getById(data.id) ];
      }
    } catch (error) {
      return this.emit(
        NOT_FOUND,
        new Error('Post/s not found'),
      );
    }

    try {
      const id = await this.RecycleBinRepository.destroyList(posts);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

RecycleBinDelete.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RecycleBinDelete;
