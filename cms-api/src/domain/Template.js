const { attributes } = require('structure');

const Template = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  modifiedBy: Number,
  category: String,
  subCategory: String,
  name: String,
  description: String,
  title: String,
  content: String,
  priorityLevel: Number,
  source: String,
  locations: Array,
  tagsAdded: Array,
  status: String,
  isPublishedImmediately: Number,
  scheduledAt: Date,
  expiredAt: Date,
  publishedAt: Date,
  isActive: Boolean,
  isEmbargo: Boolean,
})(class Template {
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

module.exports = Template;
