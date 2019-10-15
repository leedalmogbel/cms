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
  tags: Object,
  attachment: Object,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date,
})(class Advisory {
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

module.exports = Advisory;
