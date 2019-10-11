const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class ShowTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: { id } }) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const tag = (await this.TagRepository.getById(id)).toJSON();
      
      this.emit(SUCCESS, tag);
    } catch(error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details
      });
    }
  }
}

ShowTag.setEvents(['SUCCESS', 'NOT_FOUND']);

module.exports = ShowTag;
