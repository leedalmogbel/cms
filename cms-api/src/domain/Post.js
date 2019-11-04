const { attributes } = require('structure');

const Post = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  categoryId: Number,
  category: String,
  subCategory: String,
  postId: String,
  title: String,
  content: String,
  priorityLevel: String,
  source: String,
  locationAddress: String,
  locationDetails: Object,
  tagsOriginal: Array,
  tagsRetained: Array,
  tagsAdded: Array,
  tagsRemoved: Array,
  comments: Array,
  advisories: Array,
  attachments: Array,
  draft: Boolean,
  scheduledAt: Date,
  expiredAt: Date,
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
