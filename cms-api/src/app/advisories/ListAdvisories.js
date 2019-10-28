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
      advisories.map(async (advisory) => {
        advisory.tags = await advisory.getAdvisoryTags();
        // check if theres attachments
        if (!advisory.attachments) {
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
      });


      return advisories;
    } catch (error) {
      throw new Error(error.message);
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

module.exports = ListAdvisories;
