const { attributes } = require('structure');

const User = attributes({
  // Add atttributes here
  id: Number,
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date,
})(class User {
});


module.exports = User;