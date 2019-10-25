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
    // validate post id
    let post = await this.PostRepository.getById(id);

    if ('placeId' in data) {
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
    }

    // update post
    const payload = new Post(data);
    await this.PostRepository.update(id, payload);

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
