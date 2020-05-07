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
  isActive: Boolean,
  isEmbargo: Boolean,
  scheduledAt: {
    type: Date,
    nullable: true,
  },
  expiredAt: {
    type: Date,
    nullable: true,
  },
  publishedAt: {
    type: Date,
    nullable: true,
  },
  createdAt: Date,
  updatedAt: Date,
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
