const Tag = require('src/domain/Tag');
const { Operation } = require('../../infra/core/core');

class CreateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      const payload = new Tag(data);
      const tag = await this.TagRepository.add(payload);

      this.emit(SUCCESS, {
        results: tag,
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

CreateTag.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateTag;
