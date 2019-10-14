const { Operation } = require('@brewery/core');

class DeleteAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({where: {id}}) {

    try {
      await this.AdvisoryRepository.remove(id);
      
      return {
        message: 'Advisory has been deleted.'
      };
    } catch(error) {
      throw new Error(error);
    }
  }
}

module.exports = DeleteAdvisory; 
    
