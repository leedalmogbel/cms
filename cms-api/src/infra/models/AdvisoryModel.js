
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
      advisoryId : DataTypes.STRING,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      category : DataTypes.STRING,
      title : DataTypes.STRING,
      content : DataTypes.TEXT,
      source : DataTypes.STRING,
      locationAddress: DataTypes.STRING,
      locationDetails: DataTypes.JSONB,
      verified: DataTypes.BOOLEAN,
      draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: '0'
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

    AdvisoryModel.associate = () => {
      AdvisoryModel.belongsToMany(datasource.models.TagModel, {
        through: datasource.models.AdvisoryTagModel,
        as: 'advisoryTags',
        foreignKey: 'advisoryId',
        otherKey: 'tagId'
      })
    };

    return AdvisoryModel;
  }
};