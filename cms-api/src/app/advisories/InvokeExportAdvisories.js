const { Operation } = require('../../infra/core/core');
const AWS = require('aws-sdk');

class InvokeExportAdvisories extends Operation {
  async execute(data) {
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
        type: 'advisory',
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
        message: 'Export advisory now in progress.',
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

InvokeExportAdvisories.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = InvokeExportAdvisories;
