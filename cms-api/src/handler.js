const pg = require('pg'); 

module.exports.index = async (event, context, callback) => {

    const config = {
        user: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        max: 5,
      };

      const pool = new pg.Pool(config);

      const client = await pool.connect();
      const { rows } = await client.query(`
      DROP TABLE advisories CASCADE;
      DROP TABLE categories CASCADE;
      DROP TABLE tags CASCADE;
      DROP TABLE posts CASCADE;
      DROP TABLE users CASCADE; 
      `);

      console.log("rows");
};