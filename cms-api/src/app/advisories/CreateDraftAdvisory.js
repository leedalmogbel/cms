const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class CreateDraftAdvisory extends Operation {
  constructor({ AdvisoryRepository, TagRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.TagRepository = TagRepository;
  }

  async execute() {
    // build data
    const advisory = new Advisory({
      draft: true,
    });

    const newAdvisory = await this.AdvisoryRepository.add(advisory);

    // return advisory
    return { id: newAdvisory.id };
  }
}

module.exports = CreateDraftAdvisory;
