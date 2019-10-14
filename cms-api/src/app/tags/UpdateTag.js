const { Operation } = require('@brewery/core');

class UpdateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: {id}, data }) {    
    try {
      // update tag
      await this.TagRepository.update(id, data);
      // fetch tag for response
      const tag = await this.TagRepository.getById(id);
      return tag;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UpdateTag;
