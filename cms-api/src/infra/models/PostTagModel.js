
module.exports = {
  name: 'PostTagModel',
  datasource: 'kapp-cms',
  definition: function(datasource, DataTypes) {
    const PostTagModel = datasource.define('PostTagModel', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      }, 
      postId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER
    }, {
      tableName: 'postTags',
      timestamps: true
    });

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

    return PostTagModel;
  }
};
  