const { Operation } = require('@brewery/core');

class ListUsers extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const users = await this.UserRepository.getUsers(data);
      const total = await this.UserRepository.count(data);

      this.emit(SUCCESS, {
        results: users,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListUsers.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListUsers;
