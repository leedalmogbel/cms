
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
      advisoryId: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      category: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      source: DataTypes.STRING,
      locationAddress: DataTypes.STRING,
      locationDetails: DataTypes.JSON,
      verified: DataTypes.BOOLEAN,
      draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: '0',
      },
      status: DataTypes.STRING,
      tagsOriginal: DataTypes.JSON,
      tagsRetained: DataTypes.JSON,
      tagsAdded: DataTypes.JSON,
      tagsRemoved: DataTypes.JSON,
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
    };

    return AdvisoryModel;
  },
};
