const { Operation } = require('@brewery/core');
const Tag = require('src/domain/Tag');

class SavePostTags extends Operation {
  constructor({ TagRepository, PostRepository }) {
    super();
    this.TagRepository = TagRepository;
    this.PostRepository = PostRepository;
  }

  async execute(post, tags) {
    const newTags = [];

    // add post tags
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
    // then add new tags
    await post.setPostTags([]);
    await post.setPostTags(newTags);
  }
}

module.exports = SavePostTags;
