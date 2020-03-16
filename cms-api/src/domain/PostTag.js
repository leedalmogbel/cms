const { attributes } = require('structure');

const PostTag = attributes({
  // Add atttributes here
  id: Number,
  postId: Number,
  name: String,
  createdAt: Date,
  updatedAt: Date,
})(class PostTag {
});


module.exports = PostTag;
