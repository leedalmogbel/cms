
module.exports = {
  name: 'AdvisoryModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const AdvisoryModel = datasource.define('AdvisoryModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      taggedUsers: DataTypes.JSON,
      category: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      source: DataTypes.STRING,
      locationAddress: DataTypes.STRING,
      locationDetails: DataTypes.JSON,
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      status: DataTypes.STRING,
      tagsAdded: DataTypes.JSON,
      attachments: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      tableName: 'advisories',
      timestamps: true,
    });

    AdvisoryModel.associate = function () {
      AdvisoryModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
      });

      // AdvisoryModel.hasMany(datasource.models.PostAdvisoryModel, {
      //   foreignKey: 'advisoryId',
      //   as: 'postAdvisory',
      // });
    };

    return AdvisoryModel;
  },
};
