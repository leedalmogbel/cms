const { attributes } = require('structure');

const Agenda = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  title: String,
  isActive: Number,
  createdAt: Date,
  updatedAt: Date,
})(class Agenda {
});


module.exports = Agenda;
