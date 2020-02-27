const { Operation } = require('../../infra/core/core');

class ListAdvisories extends Operation {
  constructor({
    AdvisoryRepository,
    AdvisoryUserRepository,
    PostAdvisoryRepository,
    PostRepository,
  }) {
    super();

    this.AdvisoryRepository = AdvisoryRepository;
    this.AdvisoryUserRepository = AdvisoryUserRepository;
    this.PostAdvisoryRepository = PostAdvisoryRepository;
    this.PostRepository = PostRepository;
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

      advisories.map(async (advisory) => {
        advisory = advisory.toJSON();
        if (advisory.postAdvisory) {
          const posts = advisory.postAdvisory;
          const postAdvisoryDetail = [];

          posts.forEach(async (post) => {
            const postDetail = await this.PostRepository.getPostById(post.postId);
            postAdvisoryDetail.push({
              id: postDetail.id,
              postId: postDetail.postId,
              title: postDetail.title,
            });
            console.log(postAdvisoryDetail);
          });

          advisory = {
            ...advisory,
            posts: postAdvisoryDetail,
          };

          return Promise.all(advisory);
        }

        // await Promise.all(
        //   posts.map(async (post) => {
        // const postDetail = await this.PostRepository.getPostById(post.postId);
        //     // console.log('taetaetaetaetae', postDetail.toJSON());

        //     const postAdvisoryDetail = [];
        //     for (let i = 0; i < postDetail.length(); i += 1) {
        //       postAdvisoryDetail.push({
        //         id: postDetail.id,
        //         postId: postDetail.postId,
        //         title: postDetail.title,
        //       });
        //     }

        //     console.log('taeaseas');

        //     console.log(postAdvisoryDetail);
        //     advisory = {
        //       ...advisory,
        //       posts: postAdvisoryDetail,
        //     };
        //     return postAdvisoryDetail;
        //   }),
        // ).then((linkedPosts) => {
        //   console.log(linkedPosts);
        // }).catch(() => {});


        // await Promise.all(
        //   posts.map(async (post) => {
        // const postDetail = await this.PostRepository.getPostById(post.postId);

        //     if (postDetail !== null) {
        //       postAdvisoryDetail.push({
        //         id: postDetail.id,
        //         postId: postDetail.postId,
        //         title: postDetail.title,
        //       });
        //     }

        //     return postAdvisoryDetail;
        //   }),
        // ).then((linkedPosts) => {
        //   console.log(linkedPosts);
        //   advisory = advisory.toJSON();
        //   advisory = {
        //     ...advisory,
        //     posts: linkedPosts,
        //   };

        //   return advisory;
        // }).catch((errors) => {
        //   console.log('Errors:', errors);
        // });

        return advisory;
      });

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

  // awaitAll(list, asyncFn) {
  //   const promises = [];

  //   list.forEach((x) => {
  //     promises.push(asyncFn(x));
  //   });

  //   return Promise.all(promises);
  // }

  // doSomeAsyncStuffWith(post) {
  //   console.log(post);
  //   return Promise.resolve(post.postId);
  // }
}

ListAdvisories.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListAdvisories;
