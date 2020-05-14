const { Operation } = require('../../infra/core/core');
const mysql = require('mysql2');

class ExportPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.sequelize = this.PostRepository.model.sequelize;
  }

  async execute(data) {
    console.log('Export Started');
    console.log('export post data', data);

    const { userId } = data;
    const bucket = process.env.BUCKET_NAME;
    const today = new Date().toISOString().slice(0, 10);
    const filename = `${today}-posts-${userId}`;

    const res = await this.sequelize.query(`
      SELECT "postId", "contributors", "category", "title", "content", "locationAddress", "tagsOriginal", "tagsRetained", "tagsRemoved", "tagsAdded", "status", "publishedAt", "scheduledAt", "expiredAt", "createdAt", "updatedAt"
      UNION ALL
      SELECT postId, contributors, category, title, content, locationAddress, tagsOriginal, tagsRetained, tagsRemoved, tagsAdded, status, publishedAt, scheduledAt, expiredAt, createdAt, updatedAt
      FROM posts
      WHERE status != "initial"
      INTO OUTFILE S3 "s3://${bucket}/csv-export/${filename}"
      FIELDS TERMINATED BY ','
      OPTIONALLY ENCLOSED BY '"'
      ESCAPED BY '"'
      LINES TERMINATED BY '\r\n'
      OVERWRITE ON
    `);

    console.log('query response', res);
    console.log('Export Ended');

    return 'Success';
  }
}

ExportPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ExportPosts;
