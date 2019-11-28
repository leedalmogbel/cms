
module.exports = {
  name: 'SocketModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const SocketModel = datasource.define('SocketModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      connectionId: DataTypes.STRING,
      type: DataTypes.STRING,
    }, {
      tableName: 'sockets',
      timestamps: true,
    });

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  SocketModel.associate = function () {
     *   SocketModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return SocketModel;
  },
};
