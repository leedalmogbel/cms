
module.exports = {
  name: 'NotificationModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const NotificationModel = datasource.define('NotificationModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      message: DataTypes.STRING,
      meta: DataTypes.JSON,
      active: DataTypes.INTEGER,
    }, {
      tableName: 'notifications',
      timestamps: true,
    });


    NotificationModel.associate = () => {
      NotificationModel.belongsToMany(datasource.models.UserModel, {
        through: datasource.models.UserNotificationModel,
        as: 'users',
        foreignKey: 'notificationId',
        otherKey: 'userdId',
      });
    };

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  NotificationModel.associate = function () {
     *   NotificationModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return NotificationModel;
  },
};
