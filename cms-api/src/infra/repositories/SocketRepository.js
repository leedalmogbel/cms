
const { BaseRepository } = require('../../infra/core/core');

class SocketRepository extends BaseRepository {
  constructor({ SocketModel }) {
    super(SocketModel);
  }
}

module.exports = SocketRepository;
