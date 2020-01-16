const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

const s3 = new AWS.S3();
const Bucket = process.env.BUCKET_NAME;

class GetS3Url extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(id, args) {
    const { SUCCESS, ERROR } = this.events;

    // AWS.config.update({
    //   accessKeyId: 'AKIATB4WJMQJKPOCPEJA',
    //   secretAccessKey: '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',
    //   signatureVersion: 'v4',
    // });

    const Key = `Advisory/${id}/${args.fileName}`;
    const { fileType } = args;

    const putUrl = await this.putUrl(Key, fileType);
    const getUrl = await this.getUrl(Key);

    return this.emit(SUCCESS, {
      results: {
        uploadUrl: putUrl,
        downloadUrl: getUrl,
      },
      meta: {},
    });
  }

  async getUrl(Key) {
    try {
      const getUrl = await s3.getSignedUrl('getObject', {
        Bucket,
        Key,
      });

      return getUrl;
    } catch (err) {
      return err;
    }
  }

  async putUrl(Key, fileType) {
    try {
      const putUrl = await s3.getSignedUrl('putObject', {
        Bucket,
        Key,
        ContentType: fileType,
        ACL: 'public-read',
      });

      return putUrl;
    } catch (err) {
      return err;
    }
  }
}

GetS3Url.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = GetS3Url;
