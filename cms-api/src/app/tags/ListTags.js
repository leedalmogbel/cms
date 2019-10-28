const { Operation } = require('@brewery/core');

class ListTags extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute() {
    const tags = await this.TagRepository.getAll();
    return tags;
  }
}

module.exports = ListTags;
