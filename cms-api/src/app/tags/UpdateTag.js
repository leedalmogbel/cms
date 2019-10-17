const { Operation } = require('@brewery/core');

class UpdateTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: {id}, data }) {
    try {
      // validate tag
      await this.TagRepository.getById(id);
    } catch (error) {
      throw new Error('Tag does not exists.');
    }

    try {
      // update tag
      await this.TagRepository.update(id, data);
      
      // return true as success response
      return true;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UpdateTag;
