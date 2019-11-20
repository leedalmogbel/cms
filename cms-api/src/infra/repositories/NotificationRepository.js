
const { BaseRepository } = require('@brewery/core');

class NotificationRepository extends BaseRepository {
  constructor({ NotificationModel }) {
    super(NotificationModel);
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {};

    if ('userId' in data) {
      args.where.userId = data.userId;
    }

    args.order = [['createdAt', 'DESC']];

    return args;
  }

  getNotifications(args) {
    return this.getAll(this.buildListArgs(args));
  }
}

module.exports = NotificationRepository;
