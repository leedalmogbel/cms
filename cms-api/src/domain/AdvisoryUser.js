const { attributes } = require('structure');

const AdvisoryUser = attributes({
  // Add atttributes here
  id: Number,
  advisoryId: Number,
  userId: Number,
  createdAt: Date,
  updatedAt: Date,
})(class AdvisoryUser {
});


module.exports = AdvisoryUser;
