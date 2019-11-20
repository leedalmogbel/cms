
const { BaseRepository } = require('@brewery/core');

class UserRepository extends BaseRepository {
  constructor({ UserModel, RoleModel }) {
    super(UserModel);

    this.RoleModel = RoleModel;
  }

  buildListArgs(data = {}) {
    // init fetch arguments
    const args = {
      where: {},
    };

    if ('role' in data) {
      args.include = [
        {
          model: this.RoleModel,
          as: 'role',
          where: {
            title: data.role,
          },
        },
      ];
    }

    // offset
    if ('offset' in data) {
      args.offset = Number(data.offset);
    }

    // limit
    if ('limit' in data) {
      args.limit = Number(data.limit);
    }

    return args;
  }

  getUsers(args) {
    return this.model.findAll(this.buildListArgs(args));
  }

  count(args) {
    return this.model.count(this.buildListArgs(args));
  }

  getUserById(id) {
    return this.model.findOne({
      where: {
        id,
      },
      include: [{
        model: this.RoleModel,
        as: 'role',
      }],
    });
  }

  getByEmail(email) {
    return this.model.findOne({
      where: {
        email,
      },
      include: [{
        model: this.RoleModel,
        as: 'role',
      }],
    });
  }
}

module.exports = UserRepository;
