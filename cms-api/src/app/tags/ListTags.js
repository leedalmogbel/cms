const { Operation } = require('../../infra/core/core');

class ListTags extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const tags = await this.TagRepository.getTags(args);
      const total = await this.TagRepository.count(args);

      this.emit(SUCCESS, {
        results: tags,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListTags.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListTags;
