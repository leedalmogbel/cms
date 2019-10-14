const { Operation } = require('@brewery/core');

class DeleteTag extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute({ where: {id}, data }) {
    try {
      // update if tag exists
      await this.TagRepository.remove(id);
      return {
        message: 'Tag successfully deleted'
      }
    } catch(error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

module.exports = DeleteTag;
