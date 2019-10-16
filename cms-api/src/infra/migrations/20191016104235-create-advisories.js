'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('advisories', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      advisoryId : DataTypes.STRING,
      userId: DataTypes.INTEGER,
      categoryId : DataTypes.INTEGER,
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('advisories');
  }
};
