const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');
const Tag = require('src/domain/Tag');

class CreateAdvisory extends Operation {
  constructor({ AdvisoryRepository, TagRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.TagRepository = TagRepository;
  }

  async execute({ data }) {
    let newAdvisory;

    // build data
    const advisory = new Advisory(data);

    // create advisory
    try {
      newAdvisory = await this.AdvisoryRepository.add(advisory);

      // associate tags to adviosry
      if ('tags' in data) {
        await this.addAdvisoryTags(newAdvisory, data.tags);
      }
      
      // get associate tags
      newAdvisory.tags = await newAdvisory.getAdvisoryTags();

      // return advisory
      return newAdvisory;
    } catch(error) {
      throw new Error(error.message);
    }
  }

  async addAdvisoryTags (advisory, tags) {
    // add advisory tags
    for (let tag of tags) {
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

module.exports = CreateAdvisory;
