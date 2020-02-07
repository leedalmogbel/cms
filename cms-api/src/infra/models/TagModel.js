module.exports = {
  name: 'TagModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const TagModel = datasource.define('TagModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      meta: DataTypes.JSON,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    }, {
      tableName: 'tags',
      timestamps: true,
    });

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  TagModel.associate = function () {
     *   TagModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */
    TagModel.associate = () => {
      TagModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
      });
    };

    return TagModel;
  },
};
