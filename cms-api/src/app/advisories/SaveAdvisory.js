const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');

class SaveAdvisory extends Operation {
  constructor({ AdvisoryRepository, SaveAdvisoryTags, GetLocation }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.SaveAdvisoryTags = SaveAdvisoryTags;
    this.GetLocation = GetLocation;
  }

  async execute({ where: { id }, data }) {
    let advisory;

    // validate advisory
    try {
      advisory = await this.AdvisoryRepository.getById(id);
    } catch (error) {
      throw new Error('Advisory does not exists');
    }

    if ('placeId' in data) {
      // get location details
      const {
        locationDetails,
        locationAddress,
      } = await this.GetLocation.execute(data.placeId);

      data = {
        ...data,
        locationDetails,
        locationAddress,
      };
    }

    data = {
      ...data,
      draft: false,
    };

    // build advisory payloadexecute
    const payload = new Advisory(data);
    await this.AdvisoryRepository.update(id, payload);

    // advisory tags exists;
    if ('tags' in data) {
      // remove first tags
      // then associate tags to advisory
      await this.SaveAdvisoryTags.execute(advisory, data.tags);
    }

    // get updated advisory with associated tags
    advisory = await this.AdvisoryRepository.getById(id);
    advisory.tags = await advisory.getAdvisoryTags();

    // return advisory
    return advisory;
  }
}

module.exports = SaveAdvisory;
