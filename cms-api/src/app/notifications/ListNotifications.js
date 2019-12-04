const { Operation } = require('@brewery/core');

class ListNotifications extends Operation {
  constructor({ NotificationRepository }) {
    super();
    this.NotificationRepository = NotificationRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      let notifs = await this.NotificationRepository.getNotifications(args);
      notifs = notifs.map((notif) => {
        notif = {
          ...notif.toJSON(),
        };

        return notif;
      });

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

ListNotifications.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListNotifications;
