
const { BaseRepository } = require('../../infra/core/core');

class RoleRepository extends BaseRepository {
  constructor({ RoleModel }) {
    super(RoleModel);
  }

  getByTitle(title) {
    return this.model.findOne({
      where: {
        title,
      },
    });
  }
}

module.exports = RoleRepository;
