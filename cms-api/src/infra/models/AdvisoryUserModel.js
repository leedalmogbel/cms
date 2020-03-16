module.exports = {
  name: 'AdvisoryUserModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const AdvisoryUserModel = datasource.define('AdvisoryUserModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      advisoryId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      userId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
    }, {
      tableName: 'advisoryUsers',
      timestamps: true,
    });

    // AdvisoryUserModel.associate = () => {
    //   AdvisoryUserModel.belongsTo(datasource.models.PostModel, {
    //     foreignKey: 'postId',
    //     as: 'postAdvisory',
    //   });
    // };

    return AdvisoryUserModel;
  },
};
