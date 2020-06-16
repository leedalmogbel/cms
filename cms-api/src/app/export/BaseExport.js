const { Operation } = require('../../infra/core/core');

class BaseLocation extends Operation {
  constructor({ ExportPosts }) {
    super();
    this.ExportPosts = ExportPosts;
  }

  async export(data) {
    console.log('lambda function event', data);
    const { type } = data;
    let res = 'Done';

    switch (type) {
      case 'advisory':
        res = await this.ExportAdvisories.execute(data);
        break;
      case 'post':
      default: {
        res = await this.ExportPosts.execute(data);
        break;
      }
    }
    
    return res;
  }
}

module.exports = BaseLocation;
