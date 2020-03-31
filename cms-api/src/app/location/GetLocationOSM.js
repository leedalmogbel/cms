const { Operation } = require('../../infra/core/core');

class GetLocationOSM extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(placeId, address) {
    const url = `${process.env.OSM_AUTOSUGGEST_ENDPOINT}?search_type=dfs_query_then_fetch`;
    const osmResponse = await this.httpClient.post(url, {
      size: 20,
      query: {
        multi_match: {
          fields: ['complete_name', 'name'],
          minimum_should_match: '100%',
          query: address,
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
      const loc = hits.filter((hit) => hit._id === placeId);

      const { _id, _source } = loc[0];
      const {
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
        barangay_id = null,
        barangay = null,
        location_level = null,
        area_name = null,
        complete_name = null,
        type = null,
        sub_type = null,
        name = null,
        street = null,
        suburb = null,
      } = _source;

      // get longitude and latitude
      const latlng = location.split(',');

      return {
        address: complete_name,
        placeId: _id,
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
        barangayId: barangay_id,
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
      };
    }

    throw new Error('Location search failed');
  }
}

module.exports = GetLocationOSM;
