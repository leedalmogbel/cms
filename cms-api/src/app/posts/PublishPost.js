const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const AWS = require('aws-sdk');
const Post = require('src/domain/Post');

class PublishPost extends Operation {
  constructor({ SavePost }) {
    super();
    this.SavePost = SavePost;
    this.firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });
  }

  async execute(id, data) {
    const { SUCCESS, ERROR } = this.events;
    try {
      const post = await this.SavePost.save(id, data);

      await this.firehose.putRecord({
        DeliveryStreamName: 'AddPost-cms',
        Record: {
          Data: JSON.stringify(PublistPostStreams(post.toJSON())),
        },
      }).promise();

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
