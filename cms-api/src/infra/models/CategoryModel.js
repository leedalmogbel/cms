
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
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      parent: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      status: DataTypes.TEXT,
      priority: DataTypes.TEXT,
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
