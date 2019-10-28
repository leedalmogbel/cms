const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class CreateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ data }) {
    // return if already exists
    const existsTag = await this.TagRepository.getTagByName(data.name);
    if (existsTag) return existsTag;

    // create new tag
    const tag = new Tag(data);
    const newTag = await this.TagRepository.add(tag);

    return newTag;
  }
}

module.exports = CreateTag;
