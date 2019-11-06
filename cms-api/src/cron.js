require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const awilix = require('awilix');
const config = require('config');
const Sequelize = require('sequelize');
const moment = require('moment');
const AWS = require('aws-sdk');
const httpClient = require('./infra/http-request');
const PublistPostStreams = require('./domain/streams/PublishPostStreams');
const PmsPostStreams = require('./domain/streams/PmsPostStreams');
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

module.exports.scheduled = async () => {
  const container = await getContainer();
  const PostRepository = container.resolve('PostRepository');
  const HttpClient = container.resolve('httpClient');

  // get current timestamp
  // and timestamp 30 minutes ago
  const now = moment()
    .utcOffset('+08:00')
    .format('YYYY-MM-DD HH:mm:ss');
  const thirtyMinutes = new Date().setHours(new Date().getMinutes() - 30);
  const ago = moment(thirtyMinutes)
    .utcOffset('+08:00')
    .format('YYYY-MM-DD HH:mm:ss');

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

  posts.forEach(async (post) => {
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
      PmsPostStreams(post.toJSON()),
      {
        access_token: process.env.PMS_POST_TOKEN,
      },
    );

    console.log(`PMS response for postId: ${post.id}`, pmsRes);
    console.log(`PostId: ${post.id} was successfully published`);
  });
};
