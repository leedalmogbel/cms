const { Operation } = require('../../infra/core/core');
const AWS = require('aws-sdk');

class InvokeExportPosts extends Operation {
  async execute(data, session) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    // validate required data
    if (!('userId' in data) && !data.userId) {
      return this.emit(VALIDATION_ERROR, new Error('Params userId is required.'));
    }

    const lambda = new AWS.Lambda();
    const service = 'kapp-cms-api';
    const nodeEnv = process.env.NODE_ENV === 'local' ? 'dev' : process.env.NODE_ENV;

    const params = {
      FunctionName: `${service}-${nodeEnv}-exportCsv`,
      InvokeArgs: JSON.stringify({
        ...data,
        type: 'post',
      }),
    };

    function invokeFunc() {
      return new Promise((resolve, reject) => {
        lambda.invokeAsync(params, (error, res) => {
          if (error) return reject(error);
          resolve(res);
        });
      });
    }

    try {
      await invokeFunc(params);

      this.emit(SUCCESS, {
        meta: {},
        message: 'Export post now in progress. Please do not refresh the page while it\'s exporting. We\'ll notify you when your file is ready for download.',
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

InvokeExportPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = InvokeExportPosts;
