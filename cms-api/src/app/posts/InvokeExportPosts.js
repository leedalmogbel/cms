const { Operation } = require('../../infra/core/core');
const AWS = require('aws-sdk');

class InvokeExportPosts extends Operation {
  constructor() {
    super();
  }

  async execute(args, session) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const lambda = new AWS.Lambda();

      const params = {
        FunctionName: 'exportCsv',
        InvokeArgs: JSON.stringify({
          type: 'post'
        }),
      };

      // let res = await lambda.invokeAsync(params);
      // console.log(res);

      lambda.invokeAsync(params, (error, res) => {
        if (error) {
          console.log('invoke error', error);
        } else {
          console.log('invoke success', res);
        }
      })

      this.emit(SUCCESS, {
        results: [],
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

InvokeExportPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = InvokeExportPosts;
