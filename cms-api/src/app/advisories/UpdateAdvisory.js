const { Operation } = require('@brewery/core');
const Advisory = require('src/domain/Advisory');
const Tag = require('src/domain/Tag');

class UpdateAdvisory extends Operation {
  constructor({ AdvisoryRepository, TagRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
    this.TagRepository = TagRepository;
  }

  async save({where: {id}, data}) {
    let advisory;

    // validate advisory
    try {
      advisory = await this.AdvisoryRepository.getById(id);
    } catch (error) {
      throw new Error('Advisory does not exists');
    }

    // build advisory payloadexecute
    const payload = new Advisory(data);

    try {
      await this.AdvisoryRepository.update(id, payload);
    } catch(error) {
      throw error;
    }

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

  async publish({where: {id}, data}) {
    // set publish timestamp and draft flag
    data = {
      ...data,
      publishedAt: new Date().toISOString(),
      draft: false
    };

    // use save process
    return await this.save({
      where: { id },
      data
    });
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
    
