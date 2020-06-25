
module.exports = {
  name: 'PostModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const PostModel = datasource.define('PostModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      contributors: DataTypes.JSON,
      category: DataTypes.STRING,
      subCategory: DataTypes.STRING,
      categoryId: DataTypes.STRING,
      subCategoryId: DataTypes.STRING,
      postId: DataTypes.STRING,
      title: DataTypes.STRING(500),
      content: DataTypes.TEXT,
      priorityLevel: DataTypes.INTEGER,
      source: DataTypes.STRING,
      locationAddress: DataTypes.STRING,
      locationDetails: DataTypes.JSON,
      locations: DataTypes.JSON,
      isGeofence: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      tagsOriginal: DataTypes.JSON,
      tagsRetained: DataTypes.JSON,
      tagsAdded: DataTypes.JSON,
      tagsRemoved: DataTypes.JSON,
      comments: DataTypes.JSON,
      advisories: DataTypes.JSON,
      attachments: DataTypes.JSON,
      status: DataTypes.STRING,
      isPublishedImmediately: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      lockUser: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
      recall: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
      advancedOptions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
      isActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      isEmbargo: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      recalledAt: DataTypes.DATE,
      scheduledAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
      publishedAt: DataTypes.DATE,
    }, {
      tableName: 'posts',
      timestamps: true,
      indexes: [
        {
          name: 'idx_categoryId',
          unique: false,
          fields: ['categoryId'],
        },
        {
          name: 'idx_subCategoryId',
          unique: false,
          fields: ['subCategoryId'],
        },
        {
          name: 'idx_title',
          unique: false,
          fields: ['title'],
        },
        {
          name: 'idx_category',
          unique: false,
          fields: ['category'],
        },
        {
          name: 'idx_publishedAt',
          unique: false,
          fields: ['publishedAt'],
        },
        {
          name: 'idx_updateAt',
          unique: false,
          fields: ['updateAt'],
        },
        {
          name: 'idx_recalledAt',
          unique: false,
          fields: ['recalledAt'],
        },
        {
          name: 'idx_scheduledAt',
          unique: false,
          fields: ['scheduledAt'],
        },
        {
          name: 'idx_source',
          unique: false,
          fields: ['source'],
        },
        {
          name: 'idx_priorityLevel',
          unique: false,
          fields: ['priorityLevel'],
        },
      ],
    });

    PostModel.associate = () => {
      PostModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
      });

      PostModel.hasMany(datasource.models.PostTagModel, {
        foreignKey: 'postId',
        as: 'postTag',
      });

      PostModel.hasMany(datasource.models.PostAdvisoryModel, {
        foreignKey: 'postId',
        as: 'postAdvisories',
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

    return PostModel;
  },
};
