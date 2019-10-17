'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('postTags', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      }, 
      postId: Sequelize.INTEGER,
      tagId: Sequelize.INTEGER,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('postTags');
  }
};
