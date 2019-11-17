
module.exports = {
  name: 'RoleModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const RoleModel = datasource.define('RoleModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      permissions: DataTypes.JSON,
    }, {
      tableName: 'roles',
      timestamps: true,
    });

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  RoleModel.associate = function () {
     *   RoleModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return RoleModel;
  },
};
