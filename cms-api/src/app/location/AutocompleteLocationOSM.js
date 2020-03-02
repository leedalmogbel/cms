const { Operation } = require('../../infra/core/core');

class AutocompleteLocationOSM extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(event) {
    const { location_string } = JSON.parse(event.body);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify([]),
    };

    try {
      const osmResponse = await this.httpClient.post(process.env.OSM_AUTOSUGGEST_ENDPOINT, {
        // q: location_string,
        size: 20,
        query: {
          multi_match: {
            fields: ['complete_name', 'name'],
            type: 'phrase',
            query: location_string,
          },
        },
      });

      if (osmResponse && 'hits' in osmResponse) {
        const { hits } = osmResponse.hits;
        const places = [];

        Object.keys(hits).forEach((i) => {
          const { _id, _source } = hits[i];

          places.push({
            place: _source.complete_name,
            place_id: _id,
          });
        });

        return {
          ...response,
          body: JSON.stringify(places),
        };
      }

      return response;
    } catch (e) {
      return response;
    }
  }
}

module.exports = AutocompleteLocationOSM;
