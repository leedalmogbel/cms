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
    try {
      const advisories = await this.AdvisoryRepository.getAdvisories(args);

      // get advisory tags
      for (const advisory of advisories) {
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
      }

      return advisories;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUrl(key) {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', {
        Bucket,
        key,
      }, (err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      });
    });
  }
}

module.exports = ListAdvisories;
