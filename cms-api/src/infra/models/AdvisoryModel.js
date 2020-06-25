
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
      categoryId: DataTypes.STRING,
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
      indexes: [
        {
          name: 'idx_title',
          unique: false,
          fields: ['title'],
        },
        {
          name: 'idx_updateAt',
          unique: false,
          fields: ['updateAt'],
        },
        {
          name: 'idx_status',
          unique: false,
          fields: ['status'],
        },
        {
          name: 'idx_verified',
          unique: false,
          fields: ['verified'],
        },
      ],
    });

    AdvisoryModel.associate = function () {
      AdvisoryModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
      });

      AdvisoryModel.hasMany(datasource.models.PostAdvisoryModel, {
        foreignKey: 'advisoryId',
        as: 'advisoryPosts',
      });
    };

    return AdvisoryModel;
  },
};
