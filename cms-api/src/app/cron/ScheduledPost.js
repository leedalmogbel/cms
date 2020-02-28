const PublishPostStreams = require('src/domain/streams/PublishPostStreams');
const UpdatePostStreams = require('src/domain/streams/UpdatePostStreams');
const Post = require('src/domain/Post');
const AWS = require('aws-sdk');
const Sequelize = require('sequelize');
const moment = require('moment');
const { Operation } = require('../../infra/core/core');

const { Op } = Sequelize;

class ScheduledPost extends Operation {
  constructor({
    PostRepository, PostUtils, httpClient, UserModel,
  }) {
    super();

    this.PostRepository = PostRepository;
    this.PostUtils = PostUtils;
    this.httpClient = httpClient;
    this.UserModel = UserModel;
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
      include: [
        {
          model: this.UserModel,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });

    console.log(`List of posts to be published: ${posts.length}`);

    await Promise.all(
      posts.map(async (post) => {
        post = post.toJSON();

        // format timestamps
        post.scheduledAt = moment(post.scheduledAt).subtract(8, 'hours');
        if (post.expiredAt) {
          post.expiredAt = moment(post.expiredAt).toISOString();
        }

        // if updated scheduled post
        if (post.publishedAt) {
          if ('locations' in post && post.locations.length) {
            post = {
              ...post,
              ...post.locations[0], // add placeid & geofence field based on locations
            };
          }

          const res = await this.publish({
            ...post,
            status: 'published',
            publishedAt: new Date().toISOString(),
          });

          return res;
        }

        if (!('locations' in post) || !post.locations || !post.locations.length) {
          return;
        }

        const { locations } = post;

        return Promise.all(
          locations.map(async (loc, index) => {
            const { placeId, isGeofence } = loc;

            let publishPayload = {
              ...post,
              placeId,
              isGeofence,
              status: 'published',
              publishedAt: new Date().toISOString(),
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

            const res = await this.publish(publishPayload);
            return res;
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

    // build only if not republish post
    if (!oldPost.publishedAt) {
      data = await this.PostUtils.build(data);
      data.validateData();
    }

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
      streamPayload = UpdatePostStreams(post, oldPost);
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
