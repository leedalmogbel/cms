
module.exports = {
    name: 'TagModel',
    datasource: 'kapp-cms',
    definition: function(datasource, DataTypes) {
      const TagModel = datasource.define('TagModel', {
        id : {
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.INTEGER,
        }, 
        name : {
          type: DataTypes.STRING
        }
      }, {
        tableName: 'tags',
        timestamps: true
      });
  
      /**
       * Examples on how to associate or set relationship with other models
       * 
       *  TagModel.associate = function () {
       *   TagModel.belongsTo(datasource.models.GroupModel, {
       *     foreignKey: 'groupId',
       *     as: 'group',
       *   });
       *  };
       * 
       * refer to sequelize documentation https://sequelize.org/master/manual/associations.html
       */
  
      return TagModel;
    }
  };
    