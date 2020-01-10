const { Operation } = require('../../infra/core/core');

class AutocompleteLocation extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(event) {
    const { location_string } = event.queryStringParameters;

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
      const osmResponse = await this.httpClient.get(process.env.OSM_AUTOSUGGEST_ENDPOINT, {
        q: location_string,
        suggester: 'autocomplete_suggester_cms',
        size: 25,
      });

      if (osmResponse && 'suggest' in osmResponse) {
        const { suggestions } = osmResponse.suggest;
        const places = [];

        Object.keys(suggestions).forEach((i) => {
          const place = suggestions[i];

          places.push({
            place: place.suggestion,
            place_id: place.id,
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

module.exports = AutocompleteLocation;
