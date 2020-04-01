const { Operation } = require('../../infra/core/core');
const AWS = require('aws-sdk');

class ExportPosts extends Operation {
  constructor() {
    super();
  }

  async execute(args, session) {
    const { SUCCESS, ERROR } = this.events;

    try {
      // const lambda = new AWS.Lambda();
      
      return {
        results: 'Success'
      };
    } catch (error) {
      throw new Error('Export failed.');
    }
  }
}

ExportPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ExportPosts;
