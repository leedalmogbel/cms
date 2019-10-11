const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class CreateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ data }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;
    const tag = new Tag(data);
    
    try {
      const newTag = (await this.TagRepository.add(tag)).toJSON();

      this.emit(SUCCESS, newTag);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateTag.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateTag;
