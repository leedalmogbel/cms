const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class SavePost extends Operation {
  constructor({ PostRepository, SavePostTags, GetLocation }) {
    super();
    this.PostRepository = PostRepository;
    this.SavePostTags = SavePostTags;
    this.GetLocation = GetLocation;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      this.save(id, data);
      this.emit(SUCCESS, { id });
    } catch (error) {
      switch (error.message) {
        case 'ValidationError':
          return this.emit(VALIDATION_ERROR, error);
        case 'NotFoundError':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }

  async save(id, data) {
    const {
      locationDetails,
      locationAddress,
    } = await this.GetLocation.execute(data.placeId);

    const payload = new Post({
      ...data,
      locationDetails,
      locationAddress,
    });

    await this.PostRepository.update(id, payload);

    return this.PostRepository.getById(id);
  }
}

SavePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SavePost;
