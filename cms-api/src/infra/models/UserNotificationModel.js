module.exports = {
  name: 'UserNotificationModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const UserNotificationModel = datasource.define('UserNotificationModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      notificationId: DataTypes.INTEGER,
    }, {
      tableName: 'userNotifications',
      timestamps: true,
    });

    return UserNotificationModel;
  },
};
