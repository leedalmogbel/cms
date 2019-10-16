'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tags', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      }, 
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tags');
  }
};
