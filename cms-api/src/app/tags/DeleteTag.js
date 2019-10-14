const { Operation } = require('@brewery/core');

class DeleteTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: {id}, data }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
    
    try {
      // check if tag exists
      const tag = await this.TagRepository.getById(id);

      // update if tag exists
      if (tag) {
        await this.TagRepository.remove(id);
        this.emit(SUCCESS);
      }

      throw new Error('Tag does not exists');
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

DeleteTag.setEvents(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = DeleteTag;
