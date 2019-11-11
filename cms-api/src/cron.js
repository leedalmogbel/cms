require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const awilix = require('awilix');
const config = require('config');
const Sequelize = require('sequelize');
const moment = require('moment');
const AWS = require('aws-sdk');
const httpClient = require('./infra/http-request');
const PublistPostStreams = require('./domain/streams/PublishPostStreams');
const PmsPost = require('./domain/pms/Post');
const Post = require('./domain/Post');

const { Op } = Sequelize;
const { asClass } = awilix;

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    brewed.container.register({
      httpClient: asClass(httpClient).singleton(),
    });

    resolve(brewed.container);
  });
});

module.exports.scheduled = async (event, context, callback) => {
  const container = await getContainer();
  const PostRepository = container.resolve('PostRepository');
  const HttpClient = container.resolve('httpClient');

  // get current timestamp
  // and timestamp 30 minutes ago
  const now = new Date();
  const thirtyMinutes = new Date().setMinutes(new Date().getMinutes() - 30);
  const ago = new Date(thirtyMinutes);

  console.log('Cron Started');
  console.log('Current Datetime', now);

  // get scheduled posts
  const posts = await PostRepository.getAll({
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
      const payload = new Post({
        publishedAt: new Date().toISOString(),
      });

      // publish post and fetch updated
      await PostRepository.update(post.id, payload);
      post = await PostRepository.getById(post.id);

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
      const pmsRes = await HttpClient.post(
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
  return {
    message: 'success',
  };
};
