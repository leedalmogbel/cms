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
  // and timestamp 30 minutes ago
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  const thirtyMinutes = new Date().setHours(new Date().getMinutes() - 30);
  const ago = moment(thirtyMinutes).format('YYYY-MM-DD HH:mm:ss');

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

    await PostRepository.update(post.id, payload);
  });

  console.log(`Updated scheduled post ${posts.length}`);
};
