const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class CreateDraftAdvisory extends Operation {
  constructor({ AdvisoryRepository, TagRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.TagRepository = TagRepository;
  }

  async execute() {
    let newAdvisory;

    // build data
    const advisory = new Advisory({
      draft: true
    });

    // create advisory
    try {
      newAdvisory = await this.AdvisoryRepository.add(advisory);
    } catch(error) {
      throw error;
    }

    // return advisory
    return { id: newAdvisory.id };
  }
}

module.exports = CreateDraftAdvisory;
