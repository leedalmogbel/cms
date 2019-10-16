'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('advisoryTags', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      }, 
      advisoryId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('advisoryTags');
  }
};
