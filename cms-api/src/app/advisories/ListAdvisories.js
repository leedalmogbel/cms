const { Operation } = require('../../infra/core/core');

class ListAdvisories extends Operation {
  constructor({ AdvisoryRepository, AdvisoryUserRepository, PostAdvisoryRepository }) {
    super();

    this.AdvisoryRepository = AdvisoryRepository;
    this.AdvisoryUserRepository = AdvisoryUserRepository;
    this.PostAdvisoryRepository = PostAdvisoryRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      let advisories = await this.AdvisoryRepository.getAdvisories(args);
      let total = await this.AdvisoryRepository.count(args);

      if ('taggedUser' in args) {
        const advisoryUsers = await this.AdvisoryUserRepository.filterAdvisoryUserByUserId(
          Number(args.taggedUser),
        );

        const advisoryUserIds = advisoryUsers.map((aUsers) => aUsers.advisoryId);

        advisories = await this.AdvisoryRepository.getAdvisories({
          ...args,
          ids: advisoryUserIds,
        });

        total = await this.AdvisoryRepository.count({
          ...args,
          ids: advisoryUserIds,
        });
      }

      // advisories.map((advisory) => {
      //   advisory = advisory.toJSON();
      //   let posts = this.PostAdvisoryRepository.getPostsByAdvisoryId(advisory.id);

      //   console.log(advisory.id);

      //   return '';
      // });

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
