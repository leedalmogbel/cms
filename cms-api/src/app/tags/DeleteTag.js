const { Operation } = require('@brewery/core');

class DeleteTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: { id } }) {
    await this.TagRepository.getById(id);

    // delete tag
    // return true as success response
    await this.TagRepository.remove(id);
    return true;
  }
}

module.exports = DeleteTag;
