
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('advisories', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    advisoryId: Sequelize.STRING,
    userId: Sequelize.INTEGER,
    category: Sequelize.STRING,
    title: Sequelize.STRING,
    content: Sequelize.STRING,
    source: Sequelize.STRING,
    locationLat: Sequelize.STRING,
    locationLong: Sequelize.STRING,
    locationAddress: Sequelize.STRING,
    verified: Sequelize.BOOLEAN,
    draft: {
      type: Sequelize.BOOLEAN,
      defaultValue: '0',
    },
    tagsOriginal: Sequelize.JSON,
    tagsRetained: Sequelize.JSON,
    tagsAdded: Sequelize.JSON,
    tagsRemoved: Sequelize.JSON,
    attachments: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    publishedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('advisories'),
};
