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
      active: 1,
    },
    {
      role: 'editor',
      username: 'ivibar',
      email: 'INVibar@abs-cbn.com',
      password: '',
      firstName: 'Ivy Jean',
      lastName: 'Vibar',
      active: 1,
    },
    {
      role: 'editor',
      username: 'pquintos',
      email: 'PAQuintos@abs-cbn.com',
      password: '',
      firstName: 'Patrick Rowell',
      lastName: 'Quintos',
      active: 1,
    },
    {
      role: 'editor',
      username: 'narzadon',
      email: 'NEArzadon@abs-cbn.com',
      password: '',
      firstName: 'Noreen Ann Rowena',
      lastName: 'Arzadon',
      active: 1,
    },
    {
      role: 'editor',
      username: 'ctemple',
      email: 'CJTemple@abs-cbn.com',
      password: '',
      firstName: 'Charity Jayne',
      lastName: 'Temple',
      active: 1,
    },
    {
      role: 'editor',
      username: 'pmunji',
      email: 'Pamela_Ranillo-Munji@abs-cbn.com',
      password: '',
      firstName: 'Pamela',
      lastName: 'Munji',
      active: 1,
    },
    {
      role: 'writer',
      username: 'gwong',
      email: 'gtwong@abs-cbn.com',
      password: '',
      firstName: 'Gloria',
      lastName: 'Wong',
      active: 1,
    },
    {
      role: 'writer',
      username: 'kcaacbay',
      email: 'jzcaacbay@up.edu.ph',
      password: '',
      firstName: 'Ken',
      lastName: 'Caacbay',
      active: 1,
    },
    {
      role: 'editor',
      username: 'baclaro',
      email: 'BNAclaro@abs-cbn.com',
      password: '',
      firstName: 'Beth',
      lastName: 'Aclaro',
      active: 1,
    },
    {
      role: 'editor',
      username: 'jmacariola',
      email: 'JVMacariola@abs-cbn.com',
      password: '',
      firstName: 'Jose Carlo',
      lastName: 'Macariola',
      active: 1,
    },
    {
      role: 'editor',
      username: 'mraagas',
      email: 'REMichael@abs-cbn.com',
      password: '',
      firstName: 'Michael Jhon',
      lastName: 'Raagas',
      active: 1,
    },
    {
      role: 'writer',
      username: 'walmogbel',
      email: 'WTAlmogbel@abs-cbn.com',
      password: '',
      firstName: 'Waleed',
      lastName: 'Almogbel',
      active: 1,
    },
    {
      role: 'editor',
      username: 'jmatic',
      email: 'JBMatic@abs-cbn.com',
      password: '',
      firstName: 'Judith',
      lastName: 'Matic',
      active: 1,
    },
    {
      role: 'writer',
      username: 'jrazon',
      email: 'JRRazon@abs-cbn.com',
      password: '',
      firstName: 'Jimuel',
      lastName: 'Razon',
      active: 1,
    },
    {
      role: 'writer',
      username: 'wtauro',
      email: 'WATauro@abs-cbn.com',
      password: '',
      firstName: 'Willfred',
      lastName: 'Tauro',
      active: 1,
    },
    {
      role: 'writer',
      username: 'jppascual',
      email: 'JPPascual@abs-cbn.com',
      password: '',
      firstName: 'John',
      lastName: 'Pascual',
      active: 1,
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
