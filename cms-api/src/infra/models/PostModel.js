
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
      postId: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      priorityLevel: DataTypes.STRING,
      source: DataTypes.STRING,
      locationAddress: DataTypes.STRING,
      locationDetails: DataTypes.JSON,
      tagsOriginal: DataTypes.JSON,
      tagsRetained: DataTypes.JSON,
      tagsAdded: DataTypes.JSON,
      tagsRemoved: DataTypes.JSON,
      comments: DataTypes.JSON,
      advisories: DataTypes.JSON,
      attachments: DataTypes.JSON,
      status: DataTypes.STRING,
      isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      lockUser: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
      scheduledAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
      publishedAt: DataTypes.DATE,
      isActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    }, {
      tableName: 'posts',
      timestamps: true,
    });

    PostModel.associate = function () {
      PostModel.belongsTo(datasource.models.UserModel, {
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

    return PostModel;
  },
};
