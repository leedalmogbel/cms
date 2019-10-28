const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class SavePostTags extends Operation {
  constructor({ TagRepository }) {
    super();
    this.TagRepository = TagRepository;
  }

  async execute(post, tags) {
    // first remove tags
    await post.setPostTags([]);

    for (const tag of tags) {
      // associate tag if exists
      const existsTag = await this.TagRepository.getTagByName(tag.name);
      if (existsTag) {
        await post.addPostTag(existsTag);
        continue;
      }

      // if tag does not exists
      // create new tag
      const payload = new Tag(tag);

      try {
        const newTag = await this.TagRepository.add(payload);
        await post.addPostTag(newTag);
      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = SavePostTags;
