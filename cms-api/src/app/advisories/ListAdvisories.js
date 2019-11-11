const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const Bucket = 'kapp-cms';

class ListAdvisories extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const advisories = await this.AdvisoryRepository.getAdvisories(args);
      const total = await this.AdvisoryRepository.count(args);

      this.emit(SUCCESS, {
        results: await advisories.map((advisory) => {
          // check if theres attachments
          if (advisory.attachments && advisory.attachments.length > 0) {
            const promises = [];
            const { attachments } = advisory.attachments || [];

            attachments.map(async (attachment) => {
              promises.push({
                fileName: attachment.fileName,
                downloadUrl: await ListAdvisories.getUrl(attachment.fileName),
                uploadUrl: '',
              });

              Promise.all(promises).then(() => { attachment = promises; });
            });
          }

          return advisory.toJSON();
        }),
        meta: {
          total,
        },
      });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }

  static async getUrl(Key) {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', {
        Bucket,
        Key,
      }, (err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      });
    });
  }
}

ListAdvisories.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListAdvisories;
