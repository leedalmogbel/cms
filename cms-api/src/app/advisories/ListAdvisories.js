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

      // let posts = [];
      // const linked = await Promise.all(
      //   advisories.map(async (advisory) => {
      //     advisory = advisory.toJSON();
      //     posts = [];

      //     if (advisory.advisoryPosts) {
      //       const postDetails = advisory.advisoryPosts;

      //       postDetails.forEach((detail) => {
      //         posts.push(detail.post);
      //       });
      //     }

      //     return advisory;
      //   }),

      // ).then((advisory) => {
      //   advisory = {
      //     ...advisory,
      //     linkedPosts: posts,
      //   };
      // }).catch(() => {});

      this.emit(SUCCESS, {
        results: advisories,
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
