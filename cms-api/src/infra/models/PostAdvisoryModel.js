module.exports = {
  name: 'PostAdvisoryModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const PostAdvisoryModel = datasource.define('PostAdvisoryModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      postId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      advisoryId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
    }, {
      tableName: 'postAdvisories',
      timestamps: true,
    });

    PostAdvisoryModel.associate = () => {
      PostAdvisoryModel.belongsTo(datasource.models.PostModel, {
        foreignKey: 'postId',
        as: 'post',
      });
    };

    return PostAdvisoryModel;
  },
};
