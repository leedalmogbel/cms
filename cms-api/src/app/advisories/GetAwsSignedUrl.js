const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');

class GetAwsSignedUrl extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(args) {   
    AWS.config.update({
      accessKeyId: 'AKIATB4WJMQJKPOCPEJA',
      secretAccessKey: 'xohq7p/Bcc83NygwbERdy7ivlDAo53EvNYd0Gpv3',
      signatureVersion: 'v4'
    });
  
    const s3 = new AWS.S3();
    const Key = 'sample.png';
    const Bucket = 'kapp-cms';    
    
    const putUrl = () => {
      return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', {
          Bucket,
          Key,
          ContentType: 'image/png'
        }, function (err, url) {
          if (err) {
            reject(err);
          }
          resolve(url);
        });
      });
    }; 
    
    const getUrl =  () =>{
      return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', {
          Bucket,
          Key,
        }, function (err, url) {
          if (err) {
            reject(err);
          }
          resolve(url);
        });
      });
    };
    
    return {
      get: await getUrl(),
      put: await putUrl()
    };
  }
}

module.exports = GetAwsSignedUrl;
    
