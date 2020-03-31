
module.exports = {
  name: 'TemplateModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const TemplateModel = datasource.define('TemplateModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      modifiedBy: DataTypes.INTEGER,
      category: DataTypes.STRING,
      subCategory: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      title: DataTypes.STRING(500),
      content: DataTypes.TEXT,
      priorityLevel: DataTypes.INTEGER,
      source: DataTypes.STRING,
      locations: DataTypes.JSON,
      tagsAdded: DataTypes.JSON,
      status: DataTypes.STRING,
      isPublishedImmediately: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      scheduledAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
      publishedAt: DataTypes.DATE,
      isActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      isEmbargo: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    }, {
      tableName: 'templates',
      timestamps: true,
    });

    TemplateModel.associate = () => {
      TemplateModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
      });

      TemplateModel.belongsTo(datasource.models.UserModel, {
        foreignKey: 'modifiedBy',
        as: 'userModified',
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

    return TemplateModel;
  },
};
