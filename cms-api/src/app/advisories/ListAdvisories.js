const { Operation } = require('../../infra/core/core');

class ListAdvisories extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const advisories = await this.AdvisoryRepository.getAdvisories(args);
      const total = await this.AdvisoryRepository.count(args);

      this.emit(SUCCESS, {
        results: await advisories.map((advisory) => {
          // check if theres attachments
          if (advisory.attachments && advisory.attachments.length) {
            const promises = [];
            const { attachments } = advisory.attachments || [];

            if (attachments !== undefined) {
              attachments.forEach(async (attachment) => {
                promises.push({
                  filename: attachment.fileName,
                  filetype: attachment.filetype,
                  url: attachment.url,
                  size: attachment.size,
                });

                Promise.all(promises).then(() => { attachment = promises; });
              });
            }
          }

          return advisory.toJSON();
        }),
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListAdvisories.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListAdvisories;
