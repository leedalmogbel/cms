const { attributes } = require('structure');

const Category = attributes({
  // Add atttributes here
  id: Number,
  name: String,
  subCategories: {
    type: Array,
    itemType: Object
  },
  createdAt: Date,
  updatedAt: Date,
})(class Category {
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

module.exports = Category;
