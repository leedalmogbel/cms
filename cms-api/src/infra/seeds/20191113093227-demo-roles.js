
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('roles', [
    {
      title: 'editor',
      description: 'KAPP Editor',
      permissions: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'writer',
      description: 'KAPP Writer',
      permissions: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('roles', null, {}),
};
