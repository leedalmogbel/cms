const { Operation } = require('@brewery/core');

class ListAdvisories extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(data) {
    try {
      const advisories = await this.AdvisoryRepository.getAll({});

      return advisories;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ListAdvisories;
    
