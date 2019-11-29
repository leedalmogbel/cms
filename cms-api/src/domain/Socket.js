const { attributes } = require('structure');

const Socket = attributes({
  // Add atttributes here
  id: Number,
  userId: Number,
  connectionId: String,
  type: String,
  createdAt: Date,
  updatedAt: Date,
})(class Socket {
});


module.exports = Socket;
