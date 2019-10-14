const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class UpdateAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({where: {id}, data}) {
    const advisory = new Advisory(data);

    try {
      const newAdvisory = await this.AdvisoryRepository.update(id, advisory);
      
      return newAdvisory;
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = UpdateAdvisory; 
    
