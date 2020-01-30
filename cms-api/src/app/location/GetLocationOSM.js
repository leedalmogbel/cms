const { Operation } = require('../../infra/core/core');

class GetLocationOSM extends Operation {
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
          placeId = null,
          location = null,
          country_id = null,
          country = null,
          island_group_id = null,
          island_group = null,
          mega_region_id = null,
          mega_region = null,
          region_id = null,
          region = null,
          province_id = null,
          province = null,
          municipality_id = null,
          municipality = null,
          barangayId = null,
          barangay = null,
          location_level = null,
          area_name = null,
          complete_name = null,
          type = null,
          sub_type = null,
          name = null,
          street = null,
          suburb = null,
        } = fields;

        // get longitude and latitude
        const latlng = location.split(',');

        return {
          locationAddress: fields.complete_name,
          locationDetails: {
            placeId: place.id,
            location,
            countryId: country_id,
            country,
            islandGroupId: island_group_id,
            islandGroup: island_group,
            megaRegionId: mega_region_id,
            megaRegion: mega_region,
            regionId: region_id,
            region,
            provinceId: province_id,
            province,
            municipalityId: municipality_id,
            municipality,
            barangayId,
            barangay,
            locationLevel: location_level,
            areaName: area_name,
            completeName: complete_name,
            type,
            subType: sub_type,
            name,
            street,
            suburb,
            district: '',
            city: municipality,
            lat: latlng[0],
            lng: latlng[1],
          },
        };
      }

      throw new Error('Location search failed');
    } catch (error) {
      throw new Error('Location search failed');
    }
  }
}

module.exports = GetLocationOSM;
