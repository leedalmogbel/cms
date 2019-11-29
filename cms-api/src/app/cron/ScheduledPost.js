const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');
const Sequelize = require('sequelize');

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
    const thirtyMinutes = new Date().setMinutes(new Date().getMinutes() - 30);
    const ago = new Date(thirtyMinutes);

    console.log('Cron Started');
    console.log('Current Datetime', now);

    // get scheduled posts
    const posts = await this.PostRepository.getAll({
      where: {
        publishedAt: null,
        scheduledAt: {
          [Op.ne]: null,
          [Op.lte]: now,
          [Op.gte]: ago,
        },
      },
    });

    console.log(`List of posts to be published: ${posts.length}`);

    await Promise.all(
      posts.map(async (post) => {
        const payload = {
          publishedAt: new Date().toISOString(),
        };

        // publish post and fetch updated
        await this.PostRepository.update(post.id, payload);
        post = await this.PostRepository.getById(post.id);

        // publish to firehose
        const firehose = new AWS.Firehose({
          apiVersion: '2015-08-04',
        });

        const firehoseRes = await firehose
          .putRecord({
            DeliveryStreamName: 'AddPost-cms',
            Record: {
              Data: JSON.stringify(PublistPostStreams(post.toJSON())),
            },
          })
          .promise();

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
