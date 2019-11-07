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

    try {
      await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      data = await this.build(data);
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      this.emit(SUCCESS, {
        results: { id },
        error: null,
        meta: {},
      });
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
