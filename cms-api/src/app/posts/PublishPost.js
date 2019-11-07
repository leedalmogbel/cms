const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');

class PublishPost extends Operation {
  constructor({ PostRepository, SavePost, httpClient }) {
    super();
    this.PostRepository = PostRepository;
    this.SavePost = SavePost;
    this.httpClient = httpClient;
    this.firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data.draft = false;
    if (data.hasOwnProperty('publishedAt')) {
      data.publishedAt = new Date(data.publishedAt).toISOString();
    }

    try {
      data = await this.SavePost.build(data);
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getById(id);

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

      if (pmsRes.hasOwnProperty('error') && pmsRes.error) {
        throw new Error(`PMS Integration Error: ${pmsRes.message}`);
      }

      this.emit(SUCCESS, { id });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

PublishPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishPost;
