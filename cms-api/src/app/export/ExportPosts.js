const { Operation } = require('../../infra/core/core');

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

    const env = process.env.NODE_ENV;
    const prefix = env !== 'local' ? `csv-export-${env}` : 'csv-export-dev';

    const res = await this.sequelize.query(`
      SELECT "postId", "contributors", "category", "title", "content", "locationAddress", "tagsOriginal", "tagsRetained", "tagsRemoved", "tagsAdded", "status", "publishedAt", "scheduledAt", "expiredAt", "createdAt", "updatedAt"
      UNION ALL
      SELECT postId, contributors, IFNULL(category, ''), IFNULL(title, ''), IFNULL(content, ''), IFNULL(locationAddress, ''), IFNULL(tagsOriginal, ''), IFNULL(tagsRetained, ''), IFNULL(tagsRemoved, ''), IFNULL(tagsAdded, ''), IFNULL(status, ''), IFNULL(publishedAt, ''), IFNULL(scheduledAt, ''), IFNULL(expiredAt, ''), createdAt, updatedAt
      FROM posts
      WHERE status != "initial"
      ORDER BY updatedAt DESC
      INTO OUTFILE S3 "s3://${bucket}/${prefix}/${filename}"
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
