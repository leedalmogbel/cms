const fetch = require('node-fetch');

class Client {

  get(path, payload, headers) {
    const getPayload = (payload) => {
      const str = [];
      Object.entries(payload).map((entries) => {
        const [key, value] = entries;
        str.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
      return str.join('&');
    };
    return this.makeRequest(`${path}?${getPayload(payload)}`, headers);
  }

  post(path, payload, headers) {
    return this.makeRequest(`${path}`, headers, payload);
  }

  makeRequest(path, headers, payload) {
    return new Promise((resolve, reject) => (
      fetch(path, {
        method: payload ? 'post' : 'get',
        body: payload ? JSON.stringify(payload) : null,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then((json) => {
          resolve(json);
        })
    ));
  }
}

module.exports = Client;
