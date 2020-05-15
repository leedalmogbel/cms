const { Operation } = require('../../infra/core/core');
const AWS = require('aws-sdk');

class ExportS3Rename extends Operation {
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

    const message = `File is uploaded in - ${bucket} -> ${rawFile}`;
    console.log(message);

    // rename file by copy and delete and make public-read
    const newFilename = `csv-export/${filename}.csv`;
    const s3 = new AWS.S3();

    function copyCsv() {
      return new Promise((resolve, reject) => {
        s3.copyObject({
          Bucket: bucket,
          Key: newFilename,
          CopySource: `${bucket}/${rawFile}`,
          ACL: 'public-read',
        }, (err, data) => {
          if (err) {
            console.log('Copy s3 object error', data);
            return reject(err);
          }

          resolve(data);
        });
      });
    }

    function deletePrevCsv() {
      return new Promise((resolve, reject) => {
        s3.deleteObject({
          Bucket: bucket,
          Key: rawFile,
        }, (err, data) => {
          if (err) {
            console.log('Delete s3 object error', data);
            return reject(err);
          }

          resolve(data);
        })
      });
    }

    await copyCsv();
    await deletePrevCsv();

    return 'Success';
  }
}

ExportS3Rename.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ExportS3Rename;
