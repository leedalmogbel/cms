const PublishPostStreams = require('src/domain/streams/PublishPostStreams');
const UpdatePostStreams = require('src/domain/streams/UpdatePostStreams');
const PmsPost = require('src/domain/pms/Post');
const Post = require('src/domain/Post');
const AWS = require('aws-sdk');
const Sequelize = require('sequelize');
const { Operation } = require('../../infra/core/core');

const { Op } = Sequelize;

class ScheduledPost extends Operation {
  constructor({ PostRepository, PostUtils, httpClient }) {
    super();

    this.PostRepository = PostRepository;
    this.PostUtils = PostUtils;
    this.httpClient = httpClient;
  }

  async execute() {
    // get current timestamp
    // and timestamp 30 minutes ago
    const now = new Date();
    const oneHour = new Date().setMinutes(new Date().getMinutes() - 60);
    const ago = new Date(oneHour);

    console.log('Cron Started');
    console.log('Current Datetime', now);
    console.log('Current Datetime ago', ago);

    // get scheduled posts
    const posts = await this.PostRepository.getAll({
      where: {
        status: 'scheduled',
        scheduledAt: {
          [Op.ne]: null,
          [Op.lte]: now,
          [Op.gte]: ago,
        },
      },
    });

    console.log(`List of posts to be published: ${posts.length}`);

    await Promise.all(
      posts.map(async (oldPost) => {
        oldPost = oldPost.toJSON();

        // format timestamps
        if (oldPost.expiredAt) {
          oldPost.expiredAt = new Date(oldPost.expiredAt).toISOString();
        }

        // if updated scheduled post
        if (oldPost.publishedAt) {
          const post = await this.publish({
            ...oldPost,
            status: 'published',
            publishedAt: new Date().toISOString(),
          });

          return post;
        }

        if (!('locations' in oldPost) || !oldPost.locations || !oldPost.locations.length) {
          return;
        }

        const { locations } = oldPost;

        return Promise.all(
          locations.map(async (loc, index) => {
            const { placeId, isGeofence } = loc;

            let publishPayload = {
              ...oldPost,
              placeId,
              isGeofence,
              status: 'published',
              publishedAt: new Date().toISOString(),
              scheduledAt: new Date(oldPost.scheduledAt).toISOString(),
            };

            // set initial post id to first location
            if (index !== 0) {
              const uid = await this.PostUtils.generateUid();
              const newPostPayload = new Post({
                status: 'initial',
                postId: uid,
              });

              const newPost = await this.PostRepository.add(newPostPayload);
              const { id, postId } = newPost;

              publishPayload = {
                ...publishPayload,
                id,
                postId,
              };
            }

            const post = await this.publish(publishPayload);
            return post;
          }),
        );
      }),
    );

    console.log('Cron Ended');
  }

  async publish(data) {
    let oldPost;

    try {
      oldPost = await this.PostRepository.getById(data.id);
      oldPost = oldPost.toJSON();
    } catch (error) {
      throw new Error('Post not found');
    }

    data = await this.PostUtils.build(data);
    data.validateData();

    // publish post and fetch updated
    await this.PostRepository.update(data.id, data);
    let post = await this.PostRepository.getById(data.id);
    post = post.toJSON();

    // publish to firehose
    const firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });

    let DeliveryStreamName = process.env.FIREHOSE_POST_STREAM_ADD;
    let streamPayload = PublishPostStreams(post);

    // if republished or update post send to updatepost-cms stream
    if (oldPost.publishedAt) {
      DeliveryStreamName = process.env.FIREHOSE_POST_STREAM_UPDATE;
      streamPayload = UpdatePostStreams(post, data);
    }

    const firehoseRes = await firehose.putRecord({
      DeliveryStreamName,
      Record: {
        Data: JSON.stringify(streamPayload),
      },
    }).promise();

    console.log(`Firehose response for postId: ${post.id}`, firehoseRes);

    // publish to pms
    const pmsRes = await this.httpClient.post(
      process.env.PMS_POST_ENDPOINT,
      PublishPostStreams(post),
      {
        access_token: process.env.PMS_POST_TOKEN,
      },
    );

    console.log(`PMS response for postId: ${post.id}`, pmsRes);
    console.log(`PostId: ${post.id} was successfully published`);

    return post;
  }
}
module.exports = ScheduledPost;
