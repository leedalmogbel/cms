const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const Bucket = 'kapp-cms';

class ShowAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({ where: { id } }) {
    try {
      const advisory = await this.AdvisoryRepository.getById(id);

      // get tags for advisory
      advisory.tags = await advisory.getAdvisoryTags();

      // check if theres attachments
      if (advisory.attachments) {
        const promises = [];

        for (const attachment of advisory.attachments) {
          promises.push({
            fileName: attachment.fileName,
            downloadUrl: await this.getUrl(attachment.fileName),
            uploadUrl: '',
          });
        }

        Promise.all(promises).then(() => advisory.attachments = promises);
      }

      return advisory;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUrl(Key) {
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

module.exports = ShowAdvisory;
