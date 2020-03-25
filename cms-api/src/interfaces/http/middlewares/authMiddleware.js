const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const UserRepository = req.container.resolve('UserRepository');
  const header = req.header('authorization');

  if (header) {
    const authType = header.split(' ')[0];
    if (authType !== 'Bearer') next();

    const token = header.split(' ')[1];
    const auth = jwt.decode(token);

    // get user from auth header token
    const { identities } = auth;
    if (identities.length > 0) {
      const identity = identities[0];

      const { userId } = identity;
      if (!userId) {
        return next();
      }

      const user = await UserRepository.getByEmail(userId);
      if (!user) {
        return next();
      }

      // if user exists add session to req
      req.session = user.toJSON();
    }
  }

  next();
};
