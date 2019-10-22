const { Operation } = require('@brewery/core');
const https = require('https');

class ShowLocation extends Operation {
  async execute({ placeId }) {
    // get google key and endpoint
    const key = process.env.PLACE_KEY;
    const endpoint = process.env.PLACE_ENDPOINT;

    // set fields
    const fields = [
      'address_components',
      'formatted_address',
      'geometry',
      'place_id',
      'types'
    ].join();

    // construct url with params
    const url = `${endpoint}?key=${key}&place_id=${placeId}&fields=${fields}`;
  
    // send place detail request
    try {
      let res = await this.request(url);

      if ('status' in res && res.status == 'OK') {
        res = res.result;

        // init response data
        let details = {};
        let data = {
          locationAddress: '',
          locationDetails: details
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
        const components = this.formatAddressComponents(
          res.address_components,
          res.types
        );

        // construct location details
        data.locationDetails = {
          ...details,
          ...components
        };

        // return location data
        return data;
      }

      throw 'Location search failed';
    } catch (err) {
      throw err;
    }
  }

  formatAddressComponents(data, locTypes) {
    let components = {};

    // required component types based on hierarchy
    // note: sequence of mapping of fields are fixed
    // please dont change the arrangement
    const required = {
      'street_number': 'streetNumber',
      'route': 'street',
      'street_address': 'street',
      'administrative_area_level_5': 'barangay',
      'neighborhood': 'barangay',
      'administrative_area_level_4': 'district',
      'sublocality': 'district',
      'sublocality_level_1': 'district',
      'sublocality_level_2': 'district',
      'sublocality_level_3': 'district',
      'sublocality_level_4': 'district',
      'sublocality_level_5': 'district',
      'administrative_area_level_3': 'city',
      'locality': 'city',
      'administrative_area_level_2': 'province',
      'administrative_area_level_1': 'region'
    };

    // iterate through components
    for (let component of data) {
      const types = component.types;
      const longName = component.long_name;
      const shortName = component.short_name;

      // console.log(component);

      // iterate through each required types
      for (let key in required) {
        if (types.includes(key)) {
          components[required[key]] = shortName;
        }
      }

      // get country
      if (types.includes('country')) {
        components.country = longName;
      }
    }

    // get location level based on types
    if (locTypes.length && locTypes[0] in required) {
      components.locationLevel = required[locTypes[0]];
    }

    return components;
  }

  request(url) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, res => {
        let data = '';
        res.setEncoding('utf-8');

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', _ => {
          resolve(JSON.parse(data));
        });
      });

      req.on('error', err => {
        reject(err);
      });

      req.end();
    });
  }
}

module.exports = ShowLocation;
