const { attributes } = require('structure');

const Advisory = attributes({
  // Add atttributes here
  id: Number,
  advisoryId: Number,
  userId: Number,
  categoryId: Number,
  category: String,
  title: String,
  content: String,
  source: String,
  locationAddress: String,
  locationDetails: Object,
  verified: Boolean,
  draft: Boolean,
  tags: Array,
  attachments: Array,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
})(class Advisory {
  validateData() {
    if (!this.category || !this.category.length) {
      throw new Error('Category is required');
    }

    if (!this.title || !this.title.length) {
      throw new Error('Title is required');
    }

    if (!this.locationDetails) {
      throw new Error('Location is required');
    }

    if (!this.source || !this.source.length) {
      throw new Error('Source is required');
    }
  }
});

module.exports = Advisory;
