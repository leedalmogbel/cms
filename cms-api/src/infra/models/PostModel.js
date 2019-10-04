
module.exports = {
  name: 'PostModel',
  datasource: 'kapp-cms',
  definition: function(datasource, DataTypes) {
    const PostModel = datasource.define('PostModel', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      }, 
      data : {
        type: DataTypes.JSONB
      },
    }, {
      tableName: 'posts',
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

    return PostModel;
  }
};
  