
module.exports = {
  name: 'CategoryModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const CategoryModel = datasource.define('CategoryModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      categoryId: DataTypes.STRING,
      parentId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      priority: DataTypes.INTEGER,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    }, {
      tableName: 'categories',
      timestamps: true,
    });

    return CategoryModel;
  },
};
