require('module').Module._initPaths();
const { brew } = require('@brewery/core');
const config = require('config');
const Sequelize = require('sequelize');
const moment = require('moment');
const Post = require('src/domain/Post');

const { Op } = Sequelize;

const getContainer = () => new Promise((resolve) => {
  brew(config, async (brewed) => {
    resolve(brewed.container);
  });
});

module.exports.scheduled = async () => {
  const container = await getContainer();
  const PostRepository = container.resolve('PostRepository');


  // get current timestamp
  // and timestamp 2 hours ago
  const utcNow = moment().format('YYYY-MM-DD HH:mm:ss UTC');
  const now = new Date(utcNow);
  const twoHoursAgo = new Date(utcNow);
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  // get scheduled posts
  const posts = await PostRepository.getAll({
    where: {
      scheduledAt: {
        [Op.ne]: null,
        [Op.lte]: now.toISOString(),
        [Op.gte]: twoHoursAgo.toISOString(),
      },
    },
  });

  // publish posts
  posts.forEach(async (post) => {
    const payload = new Post({
      publishedAt: new Date(utcNow),
    });

    await PostRepository.update(post.id, payload);
  });

  console.log(`Updated scheduled post ${posts.length}`);
};
