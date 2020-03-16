const { Operation } = require('../../infra/core/core');

class SaveTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.TagRepository.getById(id);
    } catch (error) {
      error.message = 'Tag not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      await this.TagRepository.update(id, data);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SaveTag.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveTag;
