const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const Bucket = 'kapp-cms';

class ShowAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const advisory = await this.AdvisoryRepository.getById(id);
      let { attachments } = advisory;

      // check if theres attachments
      if (attachments && attachments.length > 0) {
        const promises = [];

        attachments.forEach(async (attachment) => {
          promises.push({
            fileName: attachment.fileName,
            downloadUrl: await ShowAdvisory.getUrl(attachment.fileName),
            uploadUrl: '',
          });
        });

        Promise.all(promises).then(() => { attachments = promises; });
      }

      this.emit(SUCCESS, advisory);
    } catch (error) {
      this.emit(NOT_FOUND, {
        type: error.message,
        details: error.details,
      });
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

ShowAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ShowAdvisory;
