const { attributes } = require('structure');

const Category = attributes({
  // Add atttributes here
  id: Number,
  categoryId: String,
  name: String,
  description: String,
  parentId: String,
  status: String,
  priority: Number,
  isActive: Number,
  createdAt: Date,
  updatedAt: Date,
})(class Category {
});


module.exports = Category;
