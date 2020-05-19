const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');
const uuidv4 = require('uuid/v4');

const s3 = new AWS.S3();
const Bucket = process.env.BUCKET_NAME;

class GetS3Url extends Operation {
  constructor({}) {
    super();
  }

  async execute(id, args) {
    const { SUCCESS, ERROR } = this.events;
    const { fileType, fileName, directory } = args;

    const Key = `Category/${fileName}-${uuidv4()}`;

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
        Expires: 604800,
        // ACL: 'public-read',
      });

      return putUrl;
    } catch (err) {
      return err;
    }
  }
}

GetS3Url.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = GetS3Url;
