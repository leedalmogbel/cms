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
      const url = `${process.env.OSM_AUTOSUGGEST_ENDPOINT}`;
      const osmResponse = await this.httpClient.post(url, {
        size: 50,
        query: {
          bool: {
            must: {
              bool: {
                should: [
                  {
                    match_phrase: {
                      'complete_name.synonym': {
                        query: location_string,
                        slop: 20,
                      },
                    },
                  },
                  {
                    match_phrase: {
                      complete_name: {
                        query: location_string,
                        slop: 20,
                      },
                    },
                  },
                  {
                    match: {
                      name: {
                        query: location_string,
                        boost: 2,
                      },
                    },
                  },
                ],
              },
            },
            should: [
              {
                match: {
                  'complete_name.bigram': {
                    query: location_string,
                  },
                },
              },
            ],
          },
        },
        sort: [{
          location_level_score:
          {
            order: 'asc',
          },
        },
        '_score',
        'complete_name.keyword_sort',
        ],
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
