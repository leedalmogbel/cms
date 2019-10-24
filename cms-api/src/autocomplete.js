const fetch = require('node-fetch');

module.exports.index = async (event, context, callback) => {
  const request = (url, body) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'post',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then((json) => {
        resolve(json);
      })
    });
  };

  const res = await request(
    'https://vv0j1ovhzj.execute-api.ap-southeast-1.amazonaws.com/dev2/users/location/autocomplete',
    event.body
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