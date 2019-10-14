const { Operation } = require('@brewery/core');

class DeleteTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: {id} }) {
    try {
      // validate tag
      await this.TagRepository.getById(id);
    } catch (error) {
      throw new Error('Tag does not exists.');
    }

    try {
      // delete tag
      await this.TagRepository.remove(id);

      // return true as success response
      return true;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DeleteTag;
