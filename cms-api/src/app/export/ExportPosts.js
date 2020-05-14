const { Operation } = require('../../infra/core/core');
const mysql = require('mysql2');

class ExportPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.sequelize = this.PostRepository.model.sequelize;
  }

  async execute(data) {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    connection.connect();

    function rawQuery() {
      return new Promise((resolve, reject) => {
        connection.query(`
          SELECT "postId", "contributors", "category", "title", "content", "locationAddress", "tagsOriginal", "tagsRetained", "tagsRemoved", "tagsAdded", "status", "publishedAt", "scheduledAt", "expiredAt", "createdAt", "updatedAt"
          UNION ALL
          SELECT postId, contributors, category, title, content, locationAddress, tagsOriginal, tagsRetained, tagsRemoved, tagsAdded, status, publishedAt, scheduledAt, expiredAt, createdAt, updatedAt
          FROM posts
          WHERE status != "initial"
          INTO OUTFILE S3 "s3://kapp-cms/csv-export/2020-5-12-posts"
          FIELDS TERMINATED BY ','
          OPTIONALLY ENCLOSED BY '"'
          ESCAPED BY '"'
          LINES TERMINATED BY '\r\n'
          OVERWRITE ON
        `, (error, result, fields) => {
          console.log('test 123');
          if (error) {
            return reject(error);
          }

          resolve(result);
        });
      });
    }

    const res = await rawQuery();
    console.log('query response', res);


    // const posts = await this.sequelize.query(`
    //   SELECT "postId", "contributors", "category", "title", "content", "locationAddress", "tagsOriginal", "tagsRetained", "tagsRemoved", "tagsAdded", "status", "publishedAt", "scheduledAt", "expiredAt", "createdAt", "updatedAt"
    //   UNION ALL
    //   SELECT postId, contributors, category, title, content, locationAddress, tagsOriginal, tagsRetained, tagsRemoved, tagsAdded, status, publishedAt, scheduledAt, expiredAt, createdAt, updatedAt
    //   FROM posts
    //   WHERE status != "initial"
    //   INTO OUTFILE S3 "s3://kapp-cms/csv-export/2020-5-12-posts.csv"
    //   FIELDS TERMINATED BY ','
    //   OPTIONALLY ENCLOSED BY '"'
    //   ESCAPED BY '"'
    //   LINES TERMINATED BY '\r\n'
    //   OVERWRITE ON
    // `);

    connection.end();

    return {
      results: 'Success',
    };
  }
}

ExportPosts.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ExportPosts;
