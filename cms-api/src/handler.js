/* eslint-disable camelcase */
require('module').Module._initPaths();
const awilix = require('awilix');
const config = require('config');
const AWS = require('aws-sdk');
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

module.exports.exportS3Rename = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('ExportS3Rename').execute(event);
};

module.exports.exportS3Hook = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('ExportS3Hook').execute(event);
};

module.exports.osmLocation = async (event, context, callback) => {
  const Container = await getContainer();
  return Container.resolve('OsmAutocompleteProxy').execute(event);
};

module.exports.linkClickExternal = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const DeliveryStreamName = process.env.FIREHOSE_CLICK_EXTERNAL_LINK;

  const {
    connectivity_type,
    longitude,
    latitude,
    session_id,
    big_data_session_id,
    kapp_user_id,
    ip_address,
    action_taken,
    clicked_content,
    event_timestamp,
    post_id,
    link_destination,
    mobile_timestamp,
  } = JSON.parse(event.body);

  const validations = async () => {
    let valid = true;

    const required = () => {
      let validRequired = true;
      [
        big_data_session_id,
        kapp_user_id,
        action_taken,
        clicked_content,
        event_timestamp,
        post_id,
        link_destination,
        mobile_timestamp,
      ].map((value) => {
        validRequired = !((typeof value === 'undefined' || value.length === 0));
      });
      return validRequired;
    };

    const doubleValidity = () => {
      let double = true;
      [
        longitude,
        latitude,
      ].map((value) => {
        double = Number(value) === value && value % 1 !== 0;
      });
      return double;
    };

    const intValidity = () => {
      let integer = true;
      [
        event_timestamp,
        mobile_timestamp,
      ].map((value) => {
        integer = Number(value) === value && value % 1 === 0;
      });
      return integer;
    };

    valid = required();
    valid = doubleValidity();
    valid = intValidity();

    return valid;
  };

  if (!validations()) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify({
        message: 'Bad Request',
      }),
    };
  }

  const firehose = new AWS.Firehose({
    apiVersion: '2015-08-04',
  });

  const { RecordId } = await firehose.putRecord({
    DeliveryStreamName,
    Record: {
      Data: JSON.stringify({
        ConnectivityType,
        Longitude,
        Latitude,
        SessionID,
        BigDataSessionId,
        KAPPUserId,
        IPAddress,
        ActionTaken,
        ClickedContent,
        EventTimeStamp,
        PostId,
        LinkDestination,
        MobileTimeStamp,
      }),
    },
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify({
      success: (RecordId.length > 0),
    }),
  };
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
