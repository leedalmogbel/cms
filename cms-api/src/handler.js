require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const awilix = require('awilix');
const config = require('config');
const fetch = require('node-fetch');
const httpClient = require('./infra/http-request');

const { asClass } = awilix;

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    brewed.container.register({
      httpClient: asClass(httpClient).singleton(),
    });

    resolve(brewed.container);
  });
});

const httpPost = (url, body) => new Promise((resolve, reject) => {
  fetch(url, {
    method: 'post',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      resolve(json);
    });
});

module.exports.location = async (event, context, callback) => {
  const res = await httpPost(
    'https://vv0j1ovhzj.execute-api.ap-southeast-1.amazonaws.com/dev2/users/location/autocomplete',
    event.body,
  );

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify(res),
  };
};

module.exports.smartTags = async (event, context, callback) => {
  const res = await httpPost(
    'https://gp1g9sn1x9.execute-api.ap-southeast-1.amazonaws.com/hle-staging/api/v1/smart-tags',
    event.body,
  );

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify(res),
  };
};

module.exports.userSeeds = async (event, context, callback) => {
  const container = await getContainer();
  const UserRepository = container.resolve('UserRepository');
  const RoleRepository = container.resolve('RoleRepository');

  const roles = [
    {
      title: 'editor',
      description: 'KAPP Editor',
      permissions: null,
    },
    {
      title: 'writer',
      description: 'KAPP Writer',
      permissions: null,
    },
  ];

  await Promise.all(
    roles.map(async (role) => {
      const rle = await RoleRepository.getByTitle(role.title);
      if (rle) return;

      await RoleRepository.add(role);
    }),
  );

  const users = [
    {
      role: 'editor',
      username: 'kpuno',
      email: 'Karen_Puno@abs-cbn.com',
      password: '',
      firstName: 'Karen',
      lastName: 'Puno',
    },
    {
      role: 'editor',
      username: 'ivibar',
      email: 'INVibar@abs-cbn.com',
      password: '',
      firstName: 'Ivy Jean',
      lastName: 'Vibar',
    },
    {
      role: 'editor',
      username: 'pquintos',
      email: 'PAQuintos@abs-cbn.com',
      password: '',
      firstName: 'Patrick Rowell',
      lastName: 'Quintos',
    },
    {
      role: 'editor',
      username: 'narzadon',
      email: 'NEArzadon@abs-cbn.com',
      password: '',
      firstName: 'Noreen Ann Rowena',
      lastName: 'Arzadon',
    },
    {
      role: 'editor',
      username: 'ctemple',
      email: 'CJTemple@abs-cbn.com',
      password: '',
      firstName: 'Charity Jayne',
      lastName: 'Temple',
    },
    {
      role: 'editor',
      username: 'pmunji',
      email: 'Pamela_Ranillo-Munji@abs-cbn.com',
      password: '',
      firstName: 'Pamela',
      lastName: 'Munji',
    },
    {
      role: 'writer',
      username: 'gwong',
      email: 'gtwong@abs-cbn.com',
      password: '',
      firstName: 'Gloria',
      lastName: 'Wong',
    },
    {
      role: 'writer',
      username: 'kcaacbay',
      email: 'jzcaacbay@up.edu.ph',
      password: '',
      firstName: 'Ken',
      lastName: 'Caacbay',
    },
    {
      role: 'editor',
      username: 'baclaro',
      email: 'baclaro@stratpoint.com',
      password: '',
      firstName: 'Beth',
      lastName: 'Aclaro',
    },
    {
      role: 'editor',
      username: 'jmacariola',
      email: 'jmacariola@stratpoint.com',
      password: '',
      firstName: 'Jose Carlo',
      lastName: 'Macariola',
    },
    {
      role: 'editor',
      username: 'mraagas',
      email: 'mraagas@stratpoint.com',
      password: '',
      firstName: 'Michael Jhon',
      lastName: 'Raagas',
    },
    {
      role: 'editor',
      username: 'walmogbel',
      email: 'walmogbel@stratpoint.com',
      password: '',
      firstName: 'Waleed',
      lastName: 'Almogbel',
    },
  ];

  await Promise.all(
    users.map(async (user) => {
      const usr = await UserRepository.getByEmail(user.email);
      if (usr) return;

      const role = await RoleRepository.getByTitle(user.role);
      if (!role) return;

      delete user.role;
      user.roleId = role.id;

      await UserRepository.add(user);
    }),
  );

  return 'success';
};
