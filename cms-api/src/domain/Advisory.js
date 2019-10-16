const { attributes } = require('structure');

const Advisory = attributes({
  // Add atttributes here
  id: Number,
  advisoryId: Number,
  userId: Number,
  title: String,
  content: String,
  source: String,
  locationLat: String,
  locationLong: String,
  locationAddress: String,
  verified: Boolean,
  draft: Boolean,
  categoryId: Number,
  tags: Array,
  attachment: Object,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
})(class Advisory {
});

module.exports = Advisory;
