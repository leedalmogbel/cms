const { Operation } = require('../../infra/core/core');

class BaseLocation extends Operation {
  constructor({ ExportPosts, ExportAdvisories }) {
    super();
    this.ExportPosts = ExportPosts;
    this.ExportAdvisories = ExportAdvisories;
  }

  async export(data) {
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
