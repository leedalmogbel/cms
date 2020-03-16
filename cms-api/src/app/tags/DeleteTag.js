const { Operation } = require('../../infra/core/core');

class DeleteTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(id) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.events;

    try {
      const Tag = await this.TagRepository.getTagById(id);

      if (!Tag || !Tag.isActive) {
        throw new Error();
      }
    } catch (error) {
      error.message = 'Tag not found';
      this.emit(NOT_FOUND, error);
    }

    try {
      await this.TagRepository.update(id, {
        isActive: 0,
      });

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

DeleteTag.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteTag;
