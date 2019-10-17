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

  async execute({ data }) {
    let newPost;

    // generate postId
    const uid = Helpers.generateUID(8);
    data.postId = uid;

    // build post data
    const post = new Post(data);
    
    // create post
    try {
      newPost = await this.PostRepository.add(post);

      // associate tags to post
      // if post tags exists
      if ('tags' in data) {
        await this.addPostTags(newPost, data.tags);
      }

      // get associated tags
      newPost.tags = await newPost.getPostTags();
      // return new post
      return newPost;
    } catch(error) {
      throw err;
    }
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
