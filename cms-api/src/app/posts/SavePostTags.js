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

    // add post tags
    tags.map(async (tag) => {
      // associate tag if exists
      const existsTag = await this.TagRepository.getTagByName(tag.name);
      if (existsTag) {
        await post.addPostTag(existsTag);
        return;
      }

      // if tag does not exists
      // create new tag
      const payload = new Tag(tag);
      const newTag = await this.TagRepository.add(payload);
      await post.addPostTag(newTag);
    });
  }
}

module.exports = SavePostTags;
