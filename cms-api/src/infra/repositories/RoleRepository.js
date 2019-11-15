
const { BaseRepository } = require('@brewery/core');

class RoleRepository extends BaseRepository {
  constructor({ RoleModel }) {
    super(RoleModel);
  }
}

module.exports = RoleRepository;
