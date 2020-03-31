
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
      type: DataTypes.STRING,
      meta: DataTypes.JSON,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      active: DataTypes.INTEGER,
    }, {
      tableName: 'notifications',
      timestamps: true,
    });

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
