const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

const s3 = new AWS.S3();
const Bucket = 'kapp-cms';

class ShowAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const advisory = await this.AdvisoryRepository.getAdvisoryById(id);
      let { attachments } = advisory;

      // check if theres attachments
      if (attachments && attachments.length) {
        const promises = [];

        attachments.forEach(async (attachment) => {
          promises.push({
            filename: attachment.filename,
            filetype: attachment.filetype,
            url: attachment.url,
          });
        });

        Promise.all(promises).then(() => { attachments = promises; });
      }

      this.emit(SUCCESS, {
        results: advisory,
        meta: {},
      });
    } catch (error) {
      error.message = 'Advisory not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

ShowAdvisory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ShowAdvisory;
