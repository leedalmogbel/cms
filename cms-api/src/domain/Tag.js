const { attributes } = require('structure');

const Tag = attributes({
  // Add atttributes here
  id: Number,
  name: String,
  type: String,
  createdAt: Date,
  updatedAt: Date,
})(class Tag {
});

module.exports = Tag;