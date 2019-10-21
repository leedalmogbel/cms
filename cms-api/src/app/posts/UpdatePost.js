const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const Tag = require('src/domain/Tag');

class UpdatePost extends Operation {
  constructor({ PostRepository, TagRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.TagRepository = TagRepository;
  }

  async save({ where: {id}, data }) {
    let post;

    // validate post
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      throw new Error('Post does not exists.');
    }

    // build post payload
    const payload = new Post(data);

    // update post
    try {
      await this.PostRepository.update(id, payload);      
    } catch(err) {
      throw err;
    }

    // if post tags exists
    if ('tags' in data) {
      // first remove tags
      // then associate tags to post
      await post.setPostTags([]);
      await this.addPostTags(post, data.tags);
    }

    // get updated post with associated tags
    post = await this.PostRepository.getById(id);
    post.tags = await post.getPostTags();

    // return updated post
    return post;
  }

  async publish({ where: {id}, data }) {
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

  async addPostTags(post, tags) {
    // add post tags
    for (let tag of tags) {
      // associate existing tag
      const existsTag = await this.TagRepository.getTagByName(tag.name);
      if (existsTag) {
        await post.addPostTag(existsTag);
        continue;
      }

      // if tag does not exists
      // create new tag 
      const payload = new Tag(tag);

      try {
        // add new post tag
        const newTag = await this.TagRepository.add(payload);
        await post.addPostTag(newTag);
      } catch (err) {
        throw err;
      }
    }
  }
}

module.exports = UpdatePost;
