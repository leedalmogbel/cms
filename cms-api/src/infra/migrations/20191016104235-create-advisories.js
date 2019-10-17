'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('advisories', {
      id : {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      advisoryId : Sequelize.STRING,
      userId: Sequelize.INTEGER,
      categoryId : Sequelize.INTEGER,
      title : Sequelize.STRING,
      content : Sequelize.STRING,
      source : Sequelize.STRING,
      locationLat : Sequelize.STRING,
      locationLong : Sequelize.STRING,
      locationAddress : Sequelize.STRING,
      verified: Sequelize.BOOLEAN,
      draft: {
        type: Sequelize.BOOLEAN,
        defaultValue: '0'
      },
      tags : {
        type: Sequelize.JSONB,
        allowNull: true
      },
      attachments : {
        type: Sequelize.JSONB,
        allowNull: true
      },
      publishedAt : {
        type:Sequelize.DATE,
        allowNull: true
      },
      createdAt : Sequelize.DATE,
      updatedAt : Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('advisories');
  }
};
