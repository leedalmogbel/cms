'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('advisoryTags', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      }, 
      advisoryId: Sequelize.INTEGER,
      tagId: Sequelize.INTEGER,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('advisoryTags');
  }
};
