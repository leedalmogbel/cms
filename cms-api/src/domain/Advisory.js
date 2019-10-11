const { attributes } = require('structure');

const Advisory = attributes({
  // Add atttributes here
  id: Number,
  title: String,
  content: String,
  attachment: String,
  tags: String,
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
