const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');
const Tag = require('src/domain/Tag');
const Helpers = require('src/interfaces/http/utils/helpers');

class CreatePost extends Operation {
  constructor({ PostRepository, TagRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.TagRepository = TagRepository;
  }

  async execute() {
    let newPost;

    // set data and generate postId
    const data = {
      postId: Helpers.generateUID(8)
    };

    // build post payload
    const payload = new Post(data);
    
    // create post
    try {
      newPost = await this.PostRepository.add(payload);
    } catch(error) {
      throw err;
    }

    // return new post
    return { id: newPost.id };
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

module.exports = CreatePost;
