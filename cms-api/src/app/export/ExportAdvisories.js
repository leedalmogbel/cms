const { Operation } = require('../../infra/core/core');

class ExportAdvisories extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.sequelize = this.PostRepository.model.sequelize;
  }

  async execute(data) {
    console.log('Export Started');
    console.log('export post data', data);

    const { userId, type } = data;
    const bucket = process.env.BUCKET_NAME;
    const today = new Date().toISOString().slice(0, 10);
    const filename = `${today}-advisories-${userId}`;

    const env = process.env.NODE_ENV;
    const prefix = env !== 'local' ? `csv-export-${env}` : 'csv-export-dev';

    const res = await this.sequelize.query(`
      SELECT "category", "title", "content", "source", "locationAddress", "tagsAdded", "publishedAt"
      UNION ALL
      SELECT IFNULL(category, ''), IFNULL(title, ''), IFNULL(content, ''), IFNULL(source, ''), IFNULL(locationAddress, ''), IFNULL(tagsAdded, ''), IFNULL(publishedAt, '')
      FROM advisories
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

module.exports = ExportAdvisories;
