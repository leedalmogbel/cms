const { attributes } = require('structure');

const RecycleBin = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  type: String,
  meta: Object,
})(class RecycleBin {
});

module.exports = RecycleBin;
