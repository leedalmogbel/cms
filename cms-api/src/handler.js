require('module').Module._initPaths();
const awilix = require('awilix');
const config = require('config');
const fetch = require('node-fetch');
const { brew } = require('../src/infra/core/core');
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
  const Container = await getContainer();
  return Container.resolve('BaseLocation').autocomplete(event);
};

module.exports.export = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('BaseExport').export(event);
};

module.exports.exportS3Hook = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('ExportS3Hook').execute(event);
};

module.exports.osmLocation = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('OsmAutocompleteProxy').execute(event);
};

module.exports.smartTags = async (event, context, callback) => {
  const body = JSON.parse(event.body);

  // add category placeholder if not available
  if (!('category' in body)) {
    body.category = '';
  }

  const res = await httpPost(
    process.env.SMART_TAGS_ENDPOINT,
    JSON.stringify(body),
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

  const users = require('./seeds.json');

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
