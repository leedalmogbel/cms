
const { BaseRepository } = require('../../infra/core/core');

class SocketRepository extends BaseRepository {
  constructor({ SocketModel }) {
    super(SocketModel);
  }

  getByUserId(userId) {
    return this.model.findOne({
      where: {
        userId,
      },
    });
  }
}

module.exports = SocketRepository;
