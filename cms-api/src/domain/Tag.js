const { attributes } = require('structure');

const Tag = attributes({
  // Add atttributes here
  id: Number,
  title: String,
  createdAt: Date,
  updatedAt: Date,
})(class Tag {
});


module.exports = Tag;