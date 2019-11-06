const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');

class PublishPost extends Operation {
  constructor({ SavePost, httpClient }) {
    super();
    this.SavePost = SavePost;
    this.httpClient = httpClient;
    this.firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });
  }

  async execute(id, data = {}) {
    const { SUCCESS, ERROR } = this.events;
    data.draft = false;

    // set published and scheduled date formats
    if (data.hasOwnProperty('scheduledAt')) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    } else {
      data.publishedAt = new Date().toISOString();
    }

    try {
      const post = await this.SavePost.save(id, data);

      // skip if scheduled post
      if (post.scheduledAt) {
        return this.emit(SUCCESS, { id });
      }

      await this.firehose
        .putRecord({
          DeliveryStreamName: 'AddPost-cms',
          Record: {
            Data: JSON.stringify(PublistPostStreams(post.toJSON())),
          },
        })
        .promise();

      const pmsRes = await this.httpClient.post(
        process.env.PMS_POST_ENDPOINT,
        PmsPost(post.toJSON()),
        {
          access_token: process.env.PMS_POST_TOKEN,
        },
      );

      console.log('PMS response', pmsRes);

      if (pmsRes.hasOwnProperty('error') && pmsRes.error) {
        throw new Error(`PMS Integration Error: ${pmsRes.message}`);
      }

      this.emit(SUCCESS, { id });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

PublishPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishPost;
