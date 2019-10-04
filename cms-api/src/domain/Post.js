const { attributes } = require('structure');

const Post = attributes({
  // Add atttributes here
  id: Number,
  data: Object,
  createdAt: Date,
  updatedAt: Date,
})(class Post {
  // Add validation functions below
  // e.g.:
  //
  // isLegal() {
  //   return this.age >= User.MIN_LEGAL_AGE;
  // }
});

// Add constants below
// e.g.:
//
// User.MIN_LEGAL_AGE = 21;

module.exports = Post;
