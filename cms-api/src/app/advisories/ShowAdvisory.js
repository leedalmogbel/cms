const { Operation } = require('@brewery/core');

class ShowAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({where : { id }}) {

    try {
      const advisory = await this.AdvisoryRepository.getById(id);

      return advisory;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

ShowAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ShowAdvisory;
    
