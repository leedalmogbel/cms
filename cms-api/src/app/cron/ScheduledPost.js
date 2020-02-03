const PublishPostStreams = require('src/domain/streams/PublishPostStreams');
const UpdatePostStreams = require('src/domain/streams/UpdatePostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');
const Sequelize = require('sequelize');
const { Operation } = require('../../infra/core/core');

const { Op } = Sequelize;

class ScheduledPost extends Operation {
  constructor({ PostRepository, httpClient }) {
    super();

    this.PostRepository = PostRepository;
    this.httpClient = httpClient;
  }

  async execute() {
    // get current timestamp
    // and timestamp 30 minutes ago
    const now = new Date();
    const thirtyMinutes = new Date().setMinutes(new Date().getMinutes() - 60);
    const ago = new Date(thirtyMinutes);

    console.log('Cron Started');
    console.log('Current Datetime', now);

    // get scheduled posts
    const posts = await this.PostRepository.getAll({
      where: {
        publishedAt: null,
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
        const payload = {
          publishedAt: new Date().toISOString(),
          status: 'published',
        };

        // publish post and fetch updated
        await this.PostRepository.update(oldPost.id, payload);
        const post = await this.PostRepository.getById(oldPost.id);

        // publish to firehose
        const firehose = new AWS.Firehose({
          apiVersion: '2015-08-04',
        });

        let DeliveryStreamName = process.env.FIREHOSE_POST_STREAM_ADD;
        let streamPayload = PublishPostStreams(post, oldPost);

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
          PmsPost(post.toJSON()),
          {
            access_token: process.env.PMS_POST_TOKEN,
          },
        );

        console.log(`PMS response for postId: ${post.id}`, pmsRes);
        console.log(`PostId: ${post.id} was successfully published`);

        return post;
      }),
    );

    console.log('Cron Ended');
  }
}
module.exports = ScheduledPost;
