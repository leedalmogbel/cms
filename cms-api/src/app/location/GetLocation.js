const { Operation } = require('@brewery/core');

class GetLocation extends Operation {
  constructor({ httpClient }) {
    super();
    this.httpClient = httpClient;
  }

  async execute(placeId) {
    const fields = [
      'address_components',
      'formatted_address',
      'geometry',
      'place_id',
      'types',
    ].join();

    // send place detail request
    let res = await this.httpClient.get(process.env.PLACE_ENDPOINT, {
      key: process.env.PLACE_KEY,
      place_id: placeId,
      fields,
    });

    if ('status' in res && res.status === 'OK') {
      res = res.result;

      const details = {};
      const data = {
        locationAddress: '',
        locationDetails: details,
      };

      // set formatted address
      data.locationAddress = res.formatted_address;

      // set longitude and latitude
      const loc = res.geometry.location;
      details.lat = loc.lat;
      details.lng = loc.lng;

      // set place id
      details.placeId = res.place_id;

      // format address components
      const components = GetLocation.formatAddressComponents(
        res.address_components,
        res.types,
      );

      // construct location details
      data.locationDetails = {
        ...details,
        ...components,
      };

      // return location data
      return data;
    }

    throw new Error('Location search failed');
  }

  static formatAddressComponents(data, locTypes) {
    const components = {
      streetNumber: null,
      street: null,
      barangay: null,
      district: null,
      city: null,
      province: null,
      region: null,
      country: null,
      locationLevel: null,
    };

    // required component types based on hierarchy
    // note: sequence of mapping of fields are fixed
    // please dont change the arrangement
    const required = {
      street_number: 'streetNumber',
      route: 'street',
      street_address: 'street',
      administrative_area_level_5: 'barangay',
      neighborhood: 'barangay',
      administrative_area_level_4: 'district',
      sublocality: 'district',
      sublocality_level_1: 'district',
      sublocality_level_2: 'district',
      sublocality_level_3: 'district',
      sublocality_level_4: 'district',
      sublocality_level_5: 'district',
      administrative_area_level_3: 'city',
      locality: 'city',
      administrative_area_level_2: 'province',
      administrative_area_level_1: 'region',
    };

    // iterate through components
    data.forEach((component) => {
      const { types } = component;
      const longName = component.long_name;
      const shortName = component.short_name;

      // iterate through each required types
      // to get address type values
      Object.keys(required).forEach((value, key) => {
        if (types.includes(key)) {
          components[value] = shortName;
        }
      });

      // get country
      if (types.includes('country')) {
        components.country = longName;
      }
    });

    // get location level based on types
    if (locTypes.length && locTypes[0] in required) {
      components.locationLevel = required[locTypes[0]];
    }

    return components;
  }
}

module.exports = GetLocation;
