const { attributes } = require('structure');

const Tag = attributes({
  // Add atttributes here
  id: Number,
  postId: Number,
  name: String,
  createdAt: Date,
  updatedAt: Date,
})(class Tag {
});


module.exports = Tag;
