const { Operation } = require('../../infra/core/core');

class ExportPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.sequelize = this.PostRepository.model.sequelize;
  }

  async execute(data) {
    const posts = await this.sequelize.query(`
      SELECT "postId", "contributors", "category", "title", "content", "locationAddress", "tagsOriginal", "tagsRetained", "tagsRemoved", "tagsAdded", "status", "publishedAt", "scheduledAt", "expiredAt", "createdAt", "updatedAt"
      UNION ALL
      SELECT postId, contributors, category, title, content, locationAddress, tagsOriginal, tagsRetained, tagsRemoved, tagsAdded, status, publishedAt, scheduledAt, expiredAt, createdAt, updatedAt
      FROM posts
      WHERE status != "initial"
      INTO OUTFILE S3 "s3://kapp-cms/csv-export/2020-4-6-posts"
      FIELDS TERMINATED BY ','
      OPTIONALLY ENCLOSED BY '"'
      ESCAPED BY '"'
      LINES TERMINATED BY '\r\n'
      MANIFEST ON
      OVERWRITE ON
    `);

    console.log('query response', posts);

    return {
      results: 'Success',
    };
  }
}

ExportPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ExportPosts;
