const { attributes } = require('structure');

const User = attributes({
  // Add atttributes here
  id: Number,
  username: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date,
})(class User {
});


module.exports = User;
