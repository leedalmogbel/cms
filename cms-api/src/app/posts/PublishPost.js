const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const AWS = require('aws-sdk');

class PublishPost extends Operation {
  constructor({ SavePost }) {
    super();
    this.SavePost = SavePost;
    this.firehose = new AWS.Firehose({
      //  accessKeyId: 'AKIATB4WJMQJKPOCPEJA',
      //  secretAccessKey: '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',
      apiVersion: '2015-08-04',
    });
  }

  async execute({ where: { id }, data }) {
    data.draft = false;

    if (!('scheduledAt' in data) || !data.scheduledAt) {
      data.publishedAt = new Date().toISOString();
    }

    // use save post process
    const post = await this.SavePost.execute({
      where: { id },
      data,
    });

    const params = {
      DeliveryStreamName: 'AddPost-cms', /* required */
      Record: { /* required */
        /* Strings will be Base-64 encoded on your behalf */ /* required */
        Data: JSON.stringify(PublistPostStreams(post.toJSON())),
      },
    };

    const streamResult = new Promise((resolve, reject) => {
      this.firehose.putRecord(params, (err, record) => {
        if (err) reject(err, err.stack);
        else resolve(record);
      });
    });

    return post;
  }
}

module.exports = PublishPost;
