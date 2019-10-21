'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      }, 
      userId: Sequelize.INTEGER,
      categoryId: Sequelize.INTEGER,
      subCategory: Sequelize.INTEGER,
      postId: Sequelize.STRING,
      title: Sequelize.STRING,
      content: Sequelize.TEXT,
      priorityLevel: Sequelize.STRING,
      source: Sequelize.STRING,
      locationLat: Sequelize.STRING,
      locationLong: Sequelize.STRING,
      locationAddress: Sequelize.STRING,
      comments: Sequelize.JSONB,
      advisories: Sequelize.JSONB,
      attachments: Sequelize.JSONB,
      draft: {
        type: Sequelize.BOOLEAN,
        defaultValue: '0'
      },
      scheduledAt: Sequelize.DATE,
      expiredAt: Sequelize.DATE,
      publishedAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts');
  }
};
