const { attributes } = require('structure');

const PostAdvisory = attributes({
  // Add atttributes here
  id: Number,
  postId: Number,
  advisoryId: Number,
  createdAt: Date,
  updatedAt: Date,
})(class PostAdvisory {
});


module.exports = PostAdvisory;
