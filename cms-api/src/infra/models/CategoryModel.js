
module.exports = {
  name: 'CategoryModel',
  datasource: 'kapp-cms',
  definition: function(datasource, DataTypes) {
    const CategoryModel = datasource.define('CategoryModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      }, 
      name: DataTypes.STRING,
      subCategories: DataTypes.JSONB
    }, {
      tableName: 'categories',
      timestamps: true
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

    return CategoryModel;
  }
};
  