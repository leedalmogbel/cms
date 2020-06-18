const { Operation } = require('../../infra/core/core');
const { filter } = require('compression');

class ExportPosts extends Operation {
  constructor({ PostRepository }) {
    super();
    this.PostRepository = PostRepository;
    this.sequelize = this.PostRepository.model.sequelize;
  }

  async execute(data) {
    console.log('Export Started');
    console.log('export post data', data);

    const self = this;
    data = data || {};

    // convert sequelize filters to raw query
    async function getRawFilters() {
      const args = await self.PostRepository.buildListArgs(data);

      // remove default limit
      if (!('limit' in data) && 'limit' in args) {
        delete args.limit;
      }

      return new Promise((resolve) => {
        self.PostRepository.getAll({
          ...args,
          logging: (raw) => {
            let filterRaw = '';
            const index = raw.indexOf('WHERE');

            if (index > -1) {
              filterRaw = raw.substr(index).replace(';', '');
              filterRaw = filterRaw.replace(/`PostModel`./g, '');
            }

            resolve(filterRaw);
          },
        });
      });
    }

    // get raw filters
    const filters = await getRawFilters();

    // format csv filename
    const { userId } = data;
    const bucket = process.env.BUCKET_NAME;
    const today = new Date().toISOString().slice(0, 10);
    const filename = `${today}-posts-${userId}`;

    // set prefix
    const env = process.env.NODE_ENV;
    const prefix = env !== 'local' ? `csv-export-${env}` : 'csv-export-dev';

    const res = await this.sequelize.query(`
      SELECT 
        "postId", 
        "contributors",
        "category",
        "title",
        "content",
        "locationAddress",
        "tagsOriginal",
        "tagsRetained",
        "tagsRemoved",
        "tagsAdded",
        "status",
        "publishedAt",
        "scheduledAt",
        "expiredAt",
        "createdAt",
        "updatedAt",
        "recalledAt"
      UNION ALL
      SELECT
        postId,
        contributors,
        IFNULL(category, ''),
        IFNULL(title, ''),
        IFNULL(content, ''),
        IFNULL(JSON_EXTRACT(locations, '$[0].address'), '') AS "locationAddress",
        IFNULL(tagsOriginal, ''),
        IFNULL(tagsRetained, ''),
        IFNULL(tagsRemoved, ''),
        IFNULL(tagsAdded, ''),
        IFNULL(status, ''),
        IFNULL(publishedAt, ''),
        IFNULL(scheduledAt, ''),
        IFNULL(expiredAt, ''),
        createdAt,
        updatedAt,
        recalledAt
      FROM posts
      ${filters}
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

module.exports = ExportPosts;
