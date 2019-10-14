
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
      advisoryId : DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      title : DataTypes.STRING,
      content : DataTypes.STRING,
      priorityLevel : DataTypes.STRING,
      source : DataTypes.STRING,
      locationLat : DataTypes.STRING,
      locationLong : DataTypes.STRING,
      locationAddress : DataTypes.STRING,
      categoryId : DataTypes.INTEGER,
      subCategoryId : DataTypes.INTEGER,
      schedule : DataTypes.DATE,
      expiration : DataTypes.DATE,
      comments : DataTypes.JSONB,
      advisories : DataTypes.JSONB,
      attachments : DataTypes.JSONB,
      tags : DataTypes.JSONB,
      publishedAt : DataTypes.DATE,
      createdAt : DataTypes.DATE,
      updatedAt : DataTypes.DATE,
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
  