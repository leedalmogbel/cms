const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class CreateAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({ data }) {
    // build data
    const advisory = new Advisory(data);

    // create advisory
    try {
      const newAdvisory = await this.AdvisoryRepository.add(advisory);
      return newAdvisory;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CreateAdvisory;
