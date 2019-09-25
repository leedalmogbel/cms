
const { BaseRepository } = require('@brewery/core');

class UserRepository extends BaseRepository {
  constructor({ UserModel }) {
    super(UserModel);
  }
}

module.exports = UserRepository;

