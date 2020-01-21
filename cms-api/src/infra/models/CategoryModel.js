
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
      categoryId: DataTypes.TEXT,
      postId: DataTypes.INTEGER,
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

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  CategoryModel.associate = function () {
     *   CategoryModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */
    CategoryModel.associate = () => {
      CategoryModel.belongsTo(datasource.models.PostModel, {
        foreignKey: 'postId',
        as: 'post',
      });
    };

    return CategoryModel;
  },
};
