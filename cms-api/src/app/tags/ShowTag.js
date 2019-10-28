const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class ShowTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: { id } }) {
    const tag = await this.TagRepository.getById(id);
    return tag;
  }
}

module.exports = ShowTag;
