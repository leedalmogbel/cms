const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');
const Tag = require('src/domain/Tag');

class UpdateAdvisory extends Operation {
  constructor({ AdvisoryRepository, TagRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.TagRepository = TagRepository;
  }

  async execute({where: {id}, data}) {
    let advisory;

    // validate advisory
    try {
      advisory = await this.AdvisoryRepository.getById(id);
    } catch (error) {
      throw new Error('Advisory does not exists');
    }

    // build advisory payload
    const payload = new Advisory(data);

    try {
      await this.AdvisoryRepository.update(id, advisory);
    } catch(error) {
      throw new Error(error.message);
    }

    // advisory tags exists;
    if ('tags' in data) {
      // remove first tags
      await advisory.setAdvisoryTags([]);
      // then associate tags to advisory
      await this.addAdvisoryTags(advisory, data.tags);
    }

    // return true as success response
    return true;
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

module.exports = UpdateAdvisory; 
    
