const { Operation } = require('../../infra/core/core');

class Login extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.events;

    if (!('email' in data)) {
      return this.emit(
        ERROR,
        new Error('Email is required.'),
      );
    }

    let user = await this.UserRepository.getByEmail(data.email);
    user = user.toJSON();

    // remove unnecessary fields
    delete user.email;

    if (!user) {
      return this.emit(
        NOT_FOUND,
        new Error('Kapp user does not exists.'),
      );
    }

    this.emit(SUCCESS, {
      results: user,
      meta: {},
    });
  }
}

Login.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = Login;
