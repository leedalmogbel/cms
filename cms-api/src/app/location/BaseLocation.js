const { Operation } = require('../../infra/core/core');

class BaseLocation extends Operation {
  constructor({
    AutocompleteLocationOSM,
    AutocompleteLocationGoogle,
    GetLocationOSM,
    GetLocationGoogle,
  }) {
    super();

    this.AutocompleteLocationOSM = AutocompleteLocationOSM;
    this.AutocompleteLocationGoogle = AutocompleteLocationGoogle;
    this.GetLocationOSM = GetLocationOSM;
    this.GetLocationGoogle = GetLocationGoogle;
  }

  async autocomplete(event) {
    const service = process.env.LOCATION_SERVICE;

    switch (service) {
      case 'google': {
        const res = await this.AutocompleteLocationGoogle
          .execute(event);

        return res;
      }
      case 'osm':
      default: {
        const res = await this.AutocompleteLocationOSM
          .execute(event);

        return res;
      }
    }
  }

  async detail(address) {
    const service = process.env.LOCATION_SERVICE;

    switch (service) {
      case 'google': {
        try {
          const res = await this.GetLocationGoogle
            .execute(address);

          return res;
        } catch (err) {
          throw new Error(err);
        }
      }
      case 'osm':
      default: {
        try {
          const res = await this.GetLocationOSM
            .execute(address);

          return res;
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  }
}

module.exports = BaseLocation;
