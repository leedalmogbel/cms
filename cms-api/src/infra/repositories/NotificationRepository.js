
const { BaseRepository } = require('../../infra/core/core');

class NotificationRepository extends BaseRepository {
  constructor({ NotificationModel }) {
    super(NotificationModel);
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {
      where: {},
    };

    if ('userId' in data) {
      args.where.userId = data.userId;
    }

    args.order = [['createdAt', 'DESC']];
    return args;
  }

  getNotifications(args) {
    return this.getAll(this.buildListArgs(args));
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }
}

module.exports = NotificationRepository;
