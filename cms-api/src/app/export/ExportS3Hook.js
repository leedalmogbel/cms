const { Operation } = require('../../infra/core/core');

class ExportS3Hook extends Operation {
  constructor({ NotificationSocket }) {
    super();
    this.NotificationSocket = NotificationSocket;
  }

  async execute(event) {
    console.log('Incoming Event: ', event);
    const object = event.Records[0].s3;

    // parse and breakdown filename
    const bucket = object.bucket.name;
    const rawFile = decodeURIComponent(object.object.key.replace(/\+/g, ' '));
    const file = rawFile.replace('csv-export/', '');
    const ext = file.split('.').pop();
    const filename = file.replace(ext, '');

    // get user id from filename
    const userId = filename.split('-').pop();

    const message = `File is uploaded in - ${bucket} -> ${rawFile}`;
    console.log(message);

    // construct file url
    const url = `https://${bucket}.s3-${process.env.REGION}.amazonaws.com/${rawFile}`;
    console.log('CSV url', url);

    // notify user the csv file is ready for download 
    await this.NotificationSocket
      .notifyUser(Number(userId), {
        type: 'CSV_EXPORT',
        message: 'Post csv file is now ready for download.',
        meta: {
          download_link: url,
        },
      });

    return 'Success';
  }
}

ExportS3Hook.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ExportS3Hook;
