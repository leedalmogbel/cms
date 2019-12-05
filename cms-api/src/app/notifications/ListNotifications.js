const { Operation } = require('@brewery/core');

class ListNotifications extends Operation {
  constructor({ NotificationRepository }) {
    super();
    this.NotificationRepository = NotificationRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const notifs = await this.NotificationRepository.getNotifications(args);
      const total = await this.NotificationRepository.count(args);

      this.emit(SUCCESS, {
        results: notifs,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListNotifications.setEvents(['SUCCESS', 'ERROR']);

module.exports = ListNotifications;
