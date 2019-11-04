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

      // get advisory tags
      this.emit(SUCCESS, await advisories.map((advisory) => {
        advisory.tags = advisory.getAdvisoryTags();
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
      }));
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
