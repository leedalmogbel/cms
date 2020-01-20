const { attributes } = require('structure');

const Agena = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  title: String,
  isActive: Number,
  createdAt: Date,
  updatedAt: Date,
})(class Agena {
});


module.exports = Agena;
