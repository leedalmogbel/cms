const { attributes } = require('structure');

const User = attributes({
  // Add atttributes here
  id: Number,
  roleId: Number,
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date,
})(class User {
});


module.exports = User;
