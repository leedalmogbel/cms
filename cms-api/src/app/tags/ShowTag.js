const { Operation } = require('../../infra/core/core');

class ShowTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const tag = await this.TagRepository.getTagById(id);

      if (!tag || !tag.isActive) {
        throw new Error();
      }

      this.emit(SUCCESS, {
        results: tag,
        meta: {},
      });
    } catch (error) {
      error.message = 'Tag not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

ShowTag.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ShowTag;
