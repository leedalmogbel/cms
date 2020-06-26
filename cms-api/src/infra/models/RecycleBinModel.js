
module.exports = {
  name: 'RecycleBinModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const RecycleBinModel = datasource.define('RecycleBinModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      meta: DataTypes.JSON,
    }, {
      tableName: 'recycleBin',
      timestamps: true,
      indexes: [
        {
          name: 'idx_type',
          unique: false,
          fields: ['type'],
        },
      ],
    });

    RecycleBinModel.associate = function () {
      RecycleBinModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
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

    return RecycleBinModel;
  },
};
