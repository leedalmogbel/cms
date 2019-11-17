
const { BaseRepository } = require('@brewery/core');

class NotificationRepository extends BaseRepository {
  constructor({ NotificationModel }) {
    super(NotificationModel);
  }
}

module.exports = NotificationRepository;
