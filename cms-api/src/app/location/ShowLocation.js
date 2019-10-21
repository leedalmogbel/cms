const { Operation } = require('@brewery/core');
const https = require('https');

class ShowLocation extends Operation {
  async execute({ placeId }) {
    const key = process.env.GOOGLE_KEY;
    const fields = 'address_component,adr_address,formatted_address,geometry';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&place_id=${placeId}&fields=${fields}`;
  
    try {
      let res = await this.request(url);

      if ('status' in res && res.status == 'OK') {
        res = res.result;

        // get longitude and latitude
        const loc = res.geometry.location;
        const lat = loc.lat;
        const lng = loc.lng;

        // get address
        const address = res.formatted_address;

        // return
        return { lat, lng, address }
      }

      throw 'Location search failed';
    } catch (err) {
      throw err;
    }
  }

  request(url) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, res => {
        let data = '';
        res.setEncoding('utf-8');

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', chunk => {
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
