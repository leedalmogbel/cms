const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');
const Tag = require('src/domain/Tag');

class SaveDraftAdvisory extends Operation {
  constructor({ AdvisoryRepository, TagRepository, GetLocation }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.TagRepository = TagRepository;
    this.GetLocation = GetLocation;
  }

  async save({ where: { id }, data }) {
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
      await advisory.setAdvisoryTags([]);
      await this.addAdvisoryTags(advisory, data.tags);
    }

    // get updated advisory with associated tags
    advisory = await this.AdvisoryRepository.getById(id);
    advisory.tags = await advisory.getAdvisoryTags();

    // return advisory
    return advisory;
  }

  async addAdvisoryTags(advisory, tags) {
    // add advisory tags
    for (const tag of tags) {
      // associate existing tag
      const tagExists = await this.TagRepository.getTagByName(tag.name);
      if (tagExists) {
        await advisory.addAdvisoryTag(tagExists);
        continue;
      }

      // if tag does not exists
      // create new tag
      const payload = new Tag(tag);

      try {
        // add new advisory tag
        const newTag = await this.TagRepository.add(payload);
        await advisory.addAdvisoryTag(newTag);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
}

module.exports = SaveDraftAdvisory;
