const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class CreateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ data }) {
    const tag = new Tag(data);
    
    try {
      const newTag = await this.TagRepository.add(tag);
      return newTag;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CreateTag;
