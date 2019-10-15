const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class CreateAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({ data }) {

    try {
      const newAdvisory = await this.AdvisoryRepository.add(advisory);

      return newAdvisory;
    } catch(error) {
      console.log(error)
      if(error.message === 'ValidationError') {
        throw new Error(error.message)
      }
    }
  }
}

module.exports = CreateAdvisory;
