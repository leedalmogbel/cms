const { Operation } = require('@brewery/core');

class ListNotifications extends Operation {
  constructor({ NotificationRepository }) {
    super();
    this.NotificationRepository = NotificationRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      let posts = await this.NotificationRepository.getNotifications(args);
      posts = posts.map((post) => {
        post = {
          ...post.toJSON(),
        };

        return post;
      });

      const total = await this.PostRepository.count(args);

      this.emit(SUCCESS, {
        results: posts,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListNotifications.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListNotifications;
