const { Operation } = require('@brewery/core');

class UpdateNotification extends Operation {
  constructor({ NotificationRepository }) {
    super();
    this.NotificationRepository = NotificationRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR,
    } = this.events;

    try {
      const notification = await this.NotificationRepository.update(id, data);
      this.emit(SUCCESS, notification);
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
}

UpdateNotification.setEvents(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = UpdateNotification;
