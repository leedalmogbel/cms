const { Operation } = require('@brewery/core');

class ShowAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({where: { id }}) {

    try {
      const advisory = await this.AdvisoryRepository.getById(id);

      return advisory;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ShowAdvisory;
    
