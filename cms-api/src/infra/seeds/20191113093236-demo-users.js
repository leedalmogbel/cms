
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
      roleId: 1,
      username: 'kpuno',
      email: 'Karen_Puno@abs-cbn.com',
      password: '',
      firstName: 'Karen',
      lastName: 'Puno',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 1,
      username: 'ivibar',
      email: 'INVibar@abs-cbn.com',
      password: '',
      firstName: 'Ivy Jean',
      lastName: 'Vibar',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 1,
      username: 'pquintos',
      email: 'PAQuintos@abs-cbn.com',
      password: '',
      firstName: 'Patrick Rowell',
      lastName: 'Quintos',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 1,
      username: 'narzadon',
      email: 'NEArzadon@abs-cbn.com',
      password: '',
      firstName: 'Noreen Ann Rowena',
      lastName: 'Arzadon',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 1,
      username: 'ctemple',
      email: 'CJTemple@abs-cbn.com',
      password: '',
      firstName: 'Charity Jayne',
      lastName: 'Temple',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 1,
      username: 'pmunji',
      email: 'Pamela_Ranillo-Munji@abs-cbn.com',
      password: '',
      firstName: 'Pamela',
      lastName: 'Munji',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 2,
      username: 'gwong',
      email: 'gtwong@abs-cbn.com',
      password: '',
      firstName: 'Gloria',
      lastName: 'Wong',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roleId: 2,
      username: 'kcaacbay',
      email: 'jzcaacbay@up.edu.ph',
      password: '',
      firstName: 'Ken',
      lastName: 'Caacbay',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
