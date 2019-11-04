const { Operation } = require('@brewery/core');


class PublishAdvisory extends Operation {
  constructor({ SaveAdvisory }) {
    super();
    this.SaveAdvisory = SaveAdvisory;
  }

  async execute(id, data = {}) {
    const { SUCCESS, ERROR } = this.events;

    // process with save advisory
    try {
      data = {
        ...data,
        publishedAt: new Date().toISOString(),
        draft: false,
      };
      await this.SaveAdvisory.execute(id, data);

      this.emit(SUCCESS, { id });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

PublishAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishAdvisory;
