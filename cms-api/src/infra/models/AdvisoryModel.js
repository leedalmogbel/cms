
module.exports = {
  name: 'AdvisoryModel',
  datasource: 'kapp-cms',
  definition: function(datasource, DataTypes) {
    const AdvisoryModel = datasource.define('AdvisoryModel', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      }, 
      title : {
        type: DataTypes.STRING
      }, content : {
        type: DataTypes.STRING
      }, attachment : {
        type: DataTypes.STRING
      }, tags : {
        type: DataTypes.STRING
      },
    }, {
      tableName: 'advisories',
      timestamps: true
    });

    /**
     * Examples on how to associate or set relationship with other models
     * 
     *  AdvisoryModel.associate = function () {
     *   AdvisoryModel.belongsTo(datasource.models.GroupModel, {
     *     foreignKey: 'groupId',
     *     as: 'group',
     *   });
     *  };
     * 
     * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
     */

    return AdvisoryModel;
  }
};
  