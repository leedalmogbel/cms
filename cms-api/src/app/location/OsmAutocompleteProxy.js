const { Operation } = require('../../infra/core/core');

class OsmAutocompleteProxy extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(event) {
    const body = JSON.parse(event.body);

    const url = `${process.env.OSM_AUTOSUGGEST_ENDPOINT}?search_type=dfs_query_then_fetch`;
    const res = await this.httpClient.post(url, body);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify(res),
    };
  }
}

module.exports = OsmAutocompleteProxy;
