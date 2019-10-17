'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      }, 
      name: Sequelize.STRING,
      subCategories: Sequelize.JSONB,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
  }
};
