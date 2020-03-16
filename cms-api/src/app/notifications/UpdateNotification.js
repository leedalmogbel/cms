const { Operation } = require('../../infra/core/core');

class UpdateNotification extends Operation {
  constructor({ NotificationRepository }) {
    super();
    this.NotificationRepository = NotificationRepository;
  }

  async execute(data) {
    const {
      SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR,
    } = this.events;

    try {
      let notification;

      if (typeof data.id !== 'number') {
        const ids = data.id;

        ids.forEach(async (id) => {
          await this.NotificationRepository.update(id, data);
        });

        notification = {
          id: ids,
        };
      } else {
        await this.NotificationRepository.update(data.id, data);

        notification = {
          id: data.id,
        };
      }

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
