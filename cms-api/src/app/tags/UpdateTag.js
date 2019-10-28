const { Operation } = require('@brewery/core');

class UpdateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: { id }, data }) {
    try {
      // validate tag
      await this.TagRepository.getById(id);
    } catch (error) {
      throw new Error('Tag does not exists.');
    }

    // update tag
    // return true as success response
    await this.TagRepository.update(id, data);
    return true;
  }
}

module.exports = UpdateTag;
