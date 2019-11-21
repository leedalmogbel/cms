
const { BaseRepository } = require('@brewery/core');

class SocketRepository extends BaseRepository {
  constructor({ SocketModel }) {
    super(SocketModel);
  }
}

module.exports = SocketRepository;
