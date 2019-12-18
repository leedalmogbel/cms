
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('posts', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    userId: Sequelize.INTEGER,
    category: Sequelize.STRING,
    subCategory: Sequelize.INTEGER,
    postId: Sequelize.STRING,
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    priorityLevel: Sequelize.STRING,
    source: Sequelize.STRING,
    locationLat: Sequelize.STRING,
    locationLong: Sequelize.STRING,
    locationAddress: Sequelize.STRING,
    tagsOriginal: Sequelize.JSON,
    tagsRetained: Sequelize.JSON,
    tagsAdded: Sequelize.JSON,
    tagsRemoved: Sequelize.JSON,
    comments: Sequelize.JSON,
    advisories: Sequelize.JSON,
    attachments: Sequelize.JSON,
    assignedUserId: Sequelize.INTEGER,
    draft: {
      type: Sequelize.BOOLEAN,
      defaultValue: '0',
    },
    scheduledAt: Sequelize.DATE,
    expiredAt: Sequelize.DATE,
    publishedAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    createdAt: Sequelize.DATE,
    isActive: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('posts'),
};
