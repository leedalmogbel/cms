const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class SavePost extends Operation {
  constructor({ PostRepository, GetLocation }) {
    super();
    this.PostRepository = PostRepository;
    this.GetLocation = GetLocation;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    const payload = await this.build(data);

    try {
      payload.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, payload);
      this.emit(SUCCESS, { id });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async build(data) {
    if ('placeId' in data) {
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

    if (data.hasOwnProperty('scheduledAt')) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    }

    return new Post(data);
  }
}

SavePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SavePost;
