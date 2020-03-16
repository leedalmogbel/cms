const { Operation } = require('../../infra/core/core');

class SavePost extends Operation {
  constructor({
    PostRepository,
    UserRepository,
    SocketRepository,
    LockPostSocket,
    PostUtils,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.SocketRepository = SocketRepository;
    this.LockPostSocket = LockPostSocket;
    this.PostUtils = PostUtils;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    const autosave = 'autosave' in data;
    let oldPost;

    try {
      oldPost = await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    const { postId } = oldPost;
    data = await this.PostUtils.build(data);

    try {
      // if autosave use silent update and auto lock post
      if (autosave) {
        const lockPost = await this.lockPost(data);

        if (lockPost) {
          const { isLocked, lockUser } = lockPost;
          data = {
            ...data.toJSON(),
            isLocked,
            lockUser,
          };
        }

        oldPost.update(data, {
          silent: true,
        });

        if (lockPost) {
          await this.broadcastLockPost({
            ...data,
            id,
            postId,
          });
        }
      } else {
        await this.PostRepository.update(id, data);
      }

      let post = await this.PostRepository.getPostById(id);
      post = post.toJSON();
      oldPost = oldPost.toJSON();

      if (!autosave) {
        await this.PostUtils.postNotifications(oldPost, post);
        await this.PostUtils.firehoseIntegrate(oldPost, post);
        await this.PostUtils.pmsIntegrate(post);
      }

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async lockPost(data) {
    if (!('userId' in data)) return false;

    // validate userId
    const user = await this.UserRepository.getUserById(data.userId);
    if (!user) return false;

    const name = `${user.firstName} ${user.lastName}`;

    // get connection by user id
    const socket = await this.SocketRepository.getByUserId(user.id);
    if (!socket) return false;

    return {
      isLocked: true,
      lockUser: {
        connectionId: socket.connectionId,
        userId: user.id,
        name,
      },
    };
  }

  async broadcastLockPost(data) {
    const {
      id,
      postId,
      userId,
      lockUser,
    } = data;

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();

    await Promise.all(
      sockets.map(async (socket) => {
        // skip same connectionId to prevent sending to self
        if (socket.connectionId === lockUser.connectionId) return;

        await this.LockPostSocket.send(socket.connectionId, {
          type: 'BROADCAST_LOCK',
          message: '',
          meta: {
            id,
            postId,
            userId,
            name: lockUser.name,
          },
        });
      }),
    );
  }
}

SavePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SavePost;
