const { Operation } = require('../../infra/core/core');

class RecallPost extends Operation {
  constructor({
    PostRepository,
    SocketRepository,
    UserRepository,
    NotificationRepository,
    httpClient,
    NotificationSocket,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.SocketRepository = SocketRepository;
    this.UserRepository = UserRepository;
    this.NotificationRepository = NotificationRepository;
    this.httpClient = httpClient;
    this.NotificationSocket = NotificationSocket;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let post;
    let action = 'cms';

    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {}

    if (!post) {
      post = await this.PostRepository.getByGeneratedPostId(id);
      action = 'pmw';

      if (!post) {
        return this.emit(NOT_FOUND, new Error('Post not found'));
      }
    }

    try {
      if (!('reasons' in data) || !data.reasons || !data.reasons.length) {
        throw new Error('Recall reasons field is required.');
      }

      if (!('description' in data) || !data.description) {
        throw new Error('Recall description is required.');
      }
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      const recalledAt = new Date().toISOString();
      const pmwMod = 'PMW Moderator';
      const { postId } = post;

      const payload = {
        status: 'recalled',
        recalledAt,
        recall: {
          ...data,
          userId: 'userId' in data ? data.userId : null,
          name: 'name' in data ? data.name : pmwMod,
        },
      };

      await this.PostRepository.update(post.id, payload);

      if (action === 'cms') {
        await this.pmsIntegrate(postId, data);
      }

      // notify all user of recalled post from pmw
      if (action === 'pmw') {
        await this.notifyUsers({
          type: 'NOTIFICATION',
          message: `${pmwMod} recalled a post ${post.title}`,
          meta: {
            id: post.id,
            postId,
            name: pmwMod,
          },
        });
      }

      let user = await this.UserRepository.getUserById(post.userId);
      user = user.toJSON();

      post = {
        ...post,
        CurrentUser: user,
      };
      await this.HistoryRepository.add({
        parentId: id,
        type: 'post',
        meta: post,
      });

      this.emit(SUCCESS, {
        results: { id },
        message: 'Post successfully recalled.',
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async pmsIntegrate(postId, data) {
    const { reasons, description } = data;
    const payload = {
      postId,
      recallReasons: reasons,
      recallDescription: description,
    };

    console.time('PMS START POST RECALL INTEGRATION');

    const res = await this.httpClient.post(
      `${process.env.PMS_POST_RECALL_ENDPOINT}/${postId}`,
      payload,
      {
        access_token: process.env.PMS_POST_TOKEN,
      },
    );

    console.time('PMS END POST RECALL INTEGRATION');
    console.log(`PMS response for id: ${data.postId}`, res, payload);
  }

  async notifyUsers(data) {
    const { message, meta } = data;
    const users = await this.UserRepository.getAll();
    if (!users || !users.length) return;

    await Promise.all(
      users.map(async (user) => {
        // save notification
        await this.NotificationRepository.add({
          userId: user.id,
          message,
          meta,
          active: 1,
        });

        // get socket
        await this.NotificationSocket.notifyUser(user.id, data);
      })
    );
  }
}

RecallPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RecallPost;
