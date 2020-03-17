const { attributes } = require('structure');

const History = attributes({
  // Add atttributes here
  id: Number,
  parentId: Number,
  type: String,
  meta: Object,
  isActive: Number,
  createdAt: Date,
  updatedAt: Date,
})(class History {
});


module.exports = History;
