const { Operation } = require('../../infra/core/core');

class GetLocation extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(placeId) {
    try {
      const osmResponse = await this.httpClient.get(process.env.OSM_DETAIL_ENDPOINT, {
        q: `_id:'${placeId}'`,
        'q.parser': 'structured',
        return: '_all_fields',
      });

      if (osmResponse && 'hits' in osmResponse && osmResponse.hits.found) {
        const place = osmResponse.hits.hit[0];
        const { fields } = place;

        const {
          street,
          barangay,
          municipality,
          province,
          region,
          country,
          type,
          location,
        } = fields;

        // get longitude and latitude
        const latlng = location.split(',');

        return {
          locationAddress: fields.complete_name,
          locationDetails: {
            streetNumber: '',
            street,
            barangay,
            district: '',
            city: municipality,
            province,
            region,
            country,
            locationLevel: type,
            lat: latlng[0],
            lng: latlng[1],
            placeId: place.id,
          },
        };
      }

      throw new Error('Location search failed');
    } catch (error) {
      throw new Error('Location search failed');
    }
  }
}

module.exports = GetLocation;
