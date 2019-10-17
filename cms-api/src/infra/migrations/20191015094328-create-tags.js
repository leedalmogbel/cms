'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tags', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      }, 
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tags');
  }
};
