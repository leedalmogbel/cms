const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class ShowTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: { id } }) {
    try {
      const tag = await this.TagRepository.getById(id);
      
      return tag;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ShowTag;
