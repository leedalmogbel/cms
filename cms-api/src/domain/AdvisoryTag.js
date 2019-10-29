const { attributes } = require('structure');

const AdvisoryTag = attributes({
  // Add atttributes here
  id: Number,
  advisoryId: Number,
  tagId: Number,
  createdAt: Date,
  updatedAt: Date,
})(class AdvisoryTag {
});

module.exports = AdvisoryTag;
