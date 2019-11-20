
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
      roleId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: '1',
      },
    }, {
      tableName: 'users',
      timestamps: true,
    });

    UserModel.associate = function () {
      UserModel.belongsTo(datasource.models.RoleModel, {
        foreignKey: 'roleId',
        as: 'role',
      });

      UserModel.belongsToMany(datasource.models.NotificationModel, {
        through: datasource.models.UserNotificationModel,
        as: 'notifications',
        foreignKey: 'userId',
        otherKey: 'notificationdId',
      });
    };

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
