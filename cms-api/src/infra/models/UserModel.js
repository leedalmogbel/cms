
module.exports = {
  name: 'UserModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const UserModel = datasource.define('UserModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
    }, {
      tableName: 'users',
      timestamps: true,
    });

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  UserModel.associate = function () {
     *   UserModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return UserModel;
  },
};
