const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');
const BUCKET_NAME = 'kapp-cms-upload-dev';
const awsID = 'AKIATB4WJMQJKPOCPEJA';
const awsSecret = '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';

const s3 = new AWS.S3({
  accessKeyId: awsID,
  secretAccessKey: awsSecret,
  signatureVersion: 'v4'
});

class GetAwsSignedUrl extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(args) {
    let url = '';
    let files = args.files;
    console.log(files[0].fileName)
    let params = {
      Bucket: BUCKET_NAME,
      Key: 'post/' + files[0].fileName + '.jpeg',
      ContentType: 'image/jpeg',
    };

    console.log(params)
    url = s3.getSignedUrl('putObject', params);
    let sample = encodeURI(url);
    return decodeURI(url); //decodeURI(sample);
    console.log('The URL is', decodeURI(url)+'');

    // for (let file of files) {
    //   console.log(file.fileName)
      

    // }

    // return [url];

    try {
      // const advisories = await this.AdvisoryRepository.getAdvisories(args);

      // // get advisory tags
      // for (let advisory of advisories) {
      //   advisory.tags = await advisory.getAdvisoryTags();
      // }


      // return advisories;
    } catch(error) {
      throw new Error(error.message);
    }
  }
}

module.exports = GetAwsSignedUrl;
    
