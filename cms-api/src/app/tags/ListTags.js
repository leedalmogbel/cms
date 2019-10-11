const { Operation } = require('@brewery/core');

class ListTags extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.events;

    try {
      const tags = await this.TagRepository.getAll({});

      this.emit(SUCCESS, tags);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

ListTags.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListTags;
    
