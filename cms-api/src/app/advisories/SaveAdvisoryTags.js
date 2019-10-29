const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class SaveAdvisoryTags extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(advisory, tags) {
    const newTags = [];

    // add advisory tags
    tags.map(async (tag) => {
      // associate tag if exists
      const existsTag = await this.TagRepository.getTagByName(tag.name);
      if (existsTag) {
        newTags.push(existsTag);
        return;
      }

      // if tag does not exists
      // create new tag
      const payload = new Tag(tag);
      const newTag = await this.TagRepository.add(payload);

      newTags.push(newTag);
    });


    // first remove tags
    await advisory.setAdvisoryTags([]);
    await advisory.addAdvisoryTag(newTags);
  }
}

module.exports = SaveAdvisoryTags;
