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
      const url = `${process.env.OSM_AUTOSUGGEST_ENDPOINT}?search_type=dfs_query_then_fetch`;
      const osmResponse = await this.httpClient.post(url, {
        size: 20,
        query: {
          multi_match: {
            fields: ['complete_name', 'name'],
            minimum_should_match: '100%',
            query: location_string,
          },
        },
        sort: [{
          _script: {
            type: 'number',
            script: {
              lang: 'painless',
              inline: "if(params.scores.containsKey(doc['location_level.keyword'].value)) { return params.scores[doc['location_level.keyword'].value];} return 10;",
              params: {
                scores: {
                  Country: 1,
                  'Island Group': 2,
                  'Mega Region': 3,
                  Region: 4,
                  Province: 5,
                  Municipality: 6,
                  District: 7,
                  Barangay: 8,
                  Exact: 9,
                },
              },
            },
            order: 'asc',
          },
        },
        '_score',
        'complete_name.keyword',
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
