const { Operation } = require('@brewery/core');

class ListTags extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute() {
    try {
      const tags = await this.TagRepository.getAll();
      return tags;
    } catch(error) {
      throw new Error(error.message);      
    }
  }
}

module.exports = ListTags;
    
