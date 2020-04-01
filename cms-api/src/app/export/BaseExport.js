const { Operation } = require('../../infra/core/core');

class BaseLocation extends Operation {
  constructor({ ExportPosts }) {
    super();
    this.ExportPosts = ExportPosts;
  }

  async export(data) {
    console.log('lambda function event', data);
    const { type } = data;

    switch (type) {
      case 'post':
      default: {
        const res = await this.ExportPosts
          .execute(data);

        return res;
      }
    }
  }
}

module.exports = BaseLocation;
