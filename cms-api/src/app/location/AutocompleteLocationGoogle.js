const { Operation } = require('../../infra/core/core');

class AutocompleteLocationGoogle extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(event) {
    const { location_string } = JSON.parse(event.body);

    const pmsEndpoint = 'https://vv0j1ovhzj.execute-api.ap-southeast-1.amazonaws.com/dev2/users/location/autocomplete';
    const googleResponse = await this.httpClient.post(pmsEndpoint, {
      location_string,
    });

    console.log('google response', googleResponse);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify(googleResponse),
    };
  }
}

module.exports = AutocompleteLocationGoogle;
