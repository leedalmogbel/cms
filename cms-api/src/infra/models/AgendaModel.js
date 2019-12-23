
module.exports = {
  name: 'AgendaModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const AgendaModel = datasource.define('AgendaModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    }, {
      tableName: 'agendas',
      timestamps: true,
    });

    /**
     * Examples on how to associate or set relationship with other models
     *
     *  AgendaModel.associate = function () {
     *   AgendaModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     *
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */
    AgendaModel.associate = () => {
      AgendaModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
      });
    };

    return AgendaModel;
  },
};
