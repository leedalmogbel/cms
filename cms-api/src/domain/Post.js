const { attributes } = require('structure');

const Post = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  contributors: Object,
  category: String,
  subCategory: String,
  postId: String,
  title: String,
  content: String,
  priorityLevel: String,
  source: String,
  locationAddress: String,
  locationDetails: Object,
  locations: Array,
  isGeofence: Number,
  tagsOriginal: Array,
  tagsRetained: Array,
  tagsAdded: Array,
  tagsRemoved: Array,
  comments: Array,
  advisories: Array,
  attachments: Array,
  assignedUserId: Number,
  status: String,
  isPublishedImmediately: Number,
  isLocked: Number,
  lockUser: Object,
  scheduledAt: Date,
  expiredAt: Date,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  isActive: Number,
})(class Post {
  // Add validation functions below
  // e.g.:
  //
  // isLegal() {
  //   return this.age >= User.MIN_LEGAL_AGE;
  // }

  validateData() {
    if (this.status !== 'draft') {
      if (!this.title || !this.title.length) {
        throw new Error('Title is required');
      }

      if (!this.category || !this.category.length) {
        throw new Error('Category is required');
      }

      if (!this.source || !this.source.length) {
        throw new Error('Source is required');
      }
    }
  }
});

// Add constants below
// e.g.:
//
// User.MIN_LEGAL_AGE = 21;

module.exports = Post;
