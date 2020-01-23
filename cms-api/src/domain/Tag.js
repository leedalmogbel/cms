const { attributes } = require('structure');

const Tag = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  name: String,
  meta: Object,
  isActive: Number,
  createdAt: Date,
  updatedAt: Date,
})(class Tag {
});


module.exports = Tag;
