const { attributes } = require('structure');

const Post = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  categoryId: Number,
  subCategory: Number,
  postId: String,
  title: String,
  content: String,
  priorityLevel: String,
  source: String,
  locationLat: String,
  locationLong: String,
  locationAddress: String,
  comments: Array,
  advisories: Array,
  attachments: Array,
  schedule: Date,
  expiration: Date,
  publishedAt: Date,
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
