const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');

class PublishPost extends Operation {
  constructor({
    PostRepository, SavePost, httpClient, UserRepository,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.SavePost = SavePost;
    this.httpClient = httpClient;
    this.firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });
    this.UserRepository = UserRepository;
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

    const status = await this.getStatus(data);

    if (status === 'published') {
      data.publishedAt = new Date().toISOString();
    }

    if ('scheduledAt' in data) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    }

    try {
      data = await this.SavePost.build({
        ...data,
        status,
      });
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      if (post.scheduledAt) {
        return this.emit(SUCCESS, {
          results: { id },
          meta: {},
        });
      }

      const firehosePayload = PublistPostStreams(post.toJSON());
      const fres = await this.firehose
        .putRecord({
          DeliveryStreamName: 'AddPost-cms',
          Record: {
            Data: JSON.stringify(firehosePayload),
          },
        })
        .promise();

      const pmsPayload = PmsPost(post.toJSON());
      const pres = await this.httpClient.post(
        process.env.PMS_POST_ENDPOINT,
        pmsPayload,
        {
          access_token: process.env.PMS_POST_TOKEN,
        },
      );

      console.log(`Firehose response for id: ${post.postId}`, fres, firehosePayload);
      console.log(`PMS response for id: ${post.postId}`, pres, pmsPayload);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async getStatus(data) {
    const { NOT_FOUND } = this.events;

    try {
      let user = await this.UserRepository.getUserById(data.userId);
      user = user.toJSON();

      if (data.scheduledAt && !data.publishedAt && user.role.title === 'editor') {
        return 'scheduled';
      }

      if (user.role.title === 'editor') {
        return 'published';
      }

      return 'for-approval';
    } catch (error) {
      error.message = 'User not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

PublishPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishPost;
