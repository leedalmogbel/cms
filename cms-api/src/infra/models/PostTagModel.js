module.exports = {
  name: 'PostTagModel',
  datasource: 'kapp-cms',
  definition(datasource, DataTypes) {
    const PostTagModel = datasource.define('PostTagModel', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      postId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      name: DataTypes.STRING,
    }, {
      tableName: 'postTags',
      timestamps: true,
    });

    PostTagModel.associate = () => {
      PostTagModel.belongsTo(datasource.models.PostModel, {
        foreignKey: 'postId',
        as: 'postTag',
      });
    };

    return PostTagModel;
  },
};
