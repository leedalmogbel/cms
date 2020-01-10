const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

const s3 = new AWS.S3();
const Bucket = 'kapp-cms';

class AttachmentUrlAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    AWS.config.update({
      accessKeyId: 'AKIATB4WJMQJKPOCPEJA',
      secretAccessKey: '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',
      signatureVersion: 'v4',
    });

    const Key = `Advisory/${args}/`;

    const getUrl = await this.getUrl(Key);
    const putUrl = await this.putUrl(Key);

    return this.emit(SUCCESS, {
      results: {
        downloadUrl: getUrl,
        uploadUrl: putUrl,
      },
      meta: {},
    });
  }

  // fetch object by filename
  // return as promise
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

  // upload file with filename
  // and return promise
  async putUrl(Key) {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', {
        Bucket,
        Key,
        ContentType: 'application/octet-stream',
        Expires: 10000,
        ACL: 'public-read',
      }, (err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      });
    });
  }
}

AttachmentUrlAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = AttachmentUrlAdvisory;
