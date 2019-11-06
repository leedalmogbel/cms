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

  validateData() {
    if (!this.category || !this.category.length) {
      throw new Error('Category is required');
    }

    if (!this.title || !this.title.length) {
      throw new Error('Title is required');
    }

    if (!this.content || !this.content.length) {
      throw new Error('Body is required');
    }

    if (!this.source || !this.source.length) {
      throw new Error('Source is required');
    }
  }
});

// Add constants below
// e.g.:
//
// User.MIN_LEGAL_AGE = 21;

module.exports = Post;
