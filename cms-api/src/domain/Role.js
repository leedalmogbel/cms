const { attributes } = require('structure');

const Role = attributes({
  // Add atttributes here
  id: Number,
  title: String,
  description: String,
  permissions: Object,
  createdAt: Date,
  updatedAt: Date,
})(class User {
});

module.exports = Role;
