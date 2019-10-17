
module.exports = {
  name: 'AdvisoryTagModel',
  datasource: 'kapp-cms',
  definition: function(datasource, DataTypes) {
    const AdvisoryTagModel = datasource.define('AdvisoryTagModel', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      advisoryId : DataTypes.INTEGER,
      tagId: DataTypes.INTEGER,
    }, {
      tableName: 'advisoryTags',
      timestamps: true
    });

    /**
     * Examples on how to associate or set relationship with other models
     * 
     *  AdvisoryTagModel.associate = function () {
     *   AdvisoryTagModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     * 
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return AdvisoryTagModel;
  }
};