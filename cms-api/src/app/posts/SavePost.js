const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class SavePost extends Operation {
  constructor({ PostRepository, SavePostTags, GetLocation }) {
    super();
    this.PostRepository = PostRepository;
    this.SavePostTags = SavePostTags;
    this.GetLocation = GetLocation;
  }

  async execute({ where: { id }, data }) {
    let post;

    try {
      // validate post id
      post = await this.PostRepository.getById(id);
    } catch (err) {
      throw err;
    }

    if ('placeId' in data) {
      try {
        // get location details
        const {
          locationDetails,
          locationAddress,
        } = await this.GetLocation.execute(data.placeId);

        data = {
          ...data,
          locationDetails,
          locationAddress,
        };
      } catch (err) {
        throw err;
      }
    }

    const payload = new Post(data);

    try {
      await this.PostRepository.update(id, payload);
    } catch (err) {
      throw err;
    }

    // if post tags exists
    // associate tags to post
    if ('tags' in data) {
      await this.SavePostTags.execute(post, data.tags);
    }

    // get updated post with associated tags
    post = await this.PostRepository.getById(id);
    post.tags = await post.getPostTags();

    return post;
  }
}

module.exports = SavePost;
