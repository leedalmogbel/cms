module.exports = {
  name: 'HistoryModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const HistoryModel = datasource.define('HistoryModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      parentId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      meta: DataTypes.JSON,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    }, {
      tableName: 'histories',
      timestamps: true,
    });

    return HistoryModel;
  },
};
