const { Operation } = require('@brewery/core');

class UpdateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: {id}, data }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
    
    try {
      // update tag
      await this.TagRepository.update(id, data);
      // fetch tag for response
      const tag = (await this.TagRepository.getById(id)).toJSON();

      this.emit(SUCCESS, tag);
    } catch(error) {
      switch(error.message) {
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

UpdateTag.setEvents(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = UpdateTag;
