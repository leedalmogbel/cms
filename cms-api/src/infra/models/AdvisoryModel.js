
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
      source : DataTypes.STRING,
      locationLat : DataTypes.STRING,
      locationLong : DataTypes.STRING,
      locationAddress : DataTypes.STRING,
      verified: DataTypes.BOOLEAN,
      draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: '0'
      },
      categoryId : {
        type:DataTypes.INTEGER,
        allowNull: true
      },
      tags : {
        type: DataTypes.JSONB,
        allowNull: true
      },
      attachments : {
        type: DataTypes.JSONB,
        allowNull: true
      },
      publishedAt : {
        type:DataTypes.DATE,
        allowNull: true
      },
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