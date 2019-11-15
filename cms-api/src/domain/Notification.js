const { attributes } = require('structure');

const Notification = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  message: String,
  meta: Object,
  active: Number,
  createdAt: Date,
  updatedAt: Date,
})(class Notification {
});


module.exports = Notification;
