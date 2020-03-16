const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

class LockPostSocket extends Operation {
  constructor({ PostRepository, UserRepository, SocketRepository }) {
    super();

    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.SocketRepository = SocketRepository;
    this.socketConnector = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.WEBSOCKET_API_ENDPOINT,
    });
  }

  async lock(event) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const { connectionId } = event.requestContext;
    const { data: { id, userId } } = JSON.parse(event.body);

    // validate userId
    let user;
    try {
      user = await this.UserRepository.getUserById(userId);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid user id',
        }),
      };
    }

    const name = `${user.firstName} ${user.lastName}`;

    // validate post
    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid post id.',
        }),
      };
    }

    if (post && post.isLocked) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Post has already been locked.',
        }),
      };
    }

    try {
      // update post without updating the updatedAt
      post.update({
        isLocked: true,
        lockUser: {
          connectionId,
          userId,
          name,
        },
      }, {
        silent: true,
      });
    } catch (error) {
      console.log('Lock Post Error', error);
    }

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();

    await Promise.all(
      sockets.map(async (socket) => {
        // skip same connectionId to prevent sending to self
        if (socket.connectionId === connectionId) return;

        await this.send(socket.connectionId, {
          type: 'BROADCAST_LOCK',
          message: '',
          meta: {
            id,
            postId: post.postId,
            userId,
            name,
          },
        });
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: 'Lock post response.',
    };
  }

  async kick(event) {
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    const { connectionId } = event.requestContext;
    const { data: { id, userId } } = JSON.parse(event.body);

    // validate userId
    let user;
    try {
      user = await this.UserRepository.getUserById(userId);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid user id',
        }),
      };
    }

    const name = `${user.firstName} ${user.lastName}`;

    // validate post
    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid post id',
        }),
      };
    }

    // notify current lock user
    if (post.isLocked && post.lockUser) {
      const currentUser = post.lockUser;
      await this.send(currentUser.connectionId, {
        type: 'BROADCAST_KICK',
        message: '',
        meta: {
          id,
          postId: post.postId,
          userId,
          name,
        },
      });
    }

    try {
      // update post without updating the updatedAt
      post.update({
        isLocked: true,
        lockUser: {
          connectionId,
          userId,
          name,
        },
      }, {
        silent: true,
      });
    } catch (error) {
      console.log('Kick Locked Post Error', error);
    }

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();

    await Promise.all(
      sockets.map(async (socket) => {
        // skip same connectionId to prevent sending to self
        if (socket.connectionId === connectionId) return;

        await this.send(socket.connectionId, {
          type: 'BROADCAST_LOCK',
          message: '',
          meta: {
            id,
            postId: post.postId,
            userId,
            name,
          },
        });
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: 'Kick lock post response.',
    };
  }

  async kickConfirm(event) {
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    const { connectionId } = event.requestContext;
    const { data: { id, userId } } = JSON.parse(event.body);

    // validate lockUser
    let user;
    try {
      user = await this.UserRepository.getUserById(userId);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid user id',
        }),
      };
    }

    const name = `${user.firstName} ${user.lastName}`;

    // validate post
    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid post id',
        }),
      };
    }

    // notify current lock user
    await this.send(post.lockUser.connectionId, {
      type: 'BROADCAST_KICK_CONFIRM',
      message: '',
      meta: {
        id,
        postId: post.postId,
        userId,
        name,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: 'Kick lock post confirm response.',
    };
  }

  async unlock(event) {
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    const { data: { id, userId } } = JSON.parse(event.body);

    // validate post
    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Invalid post id',
        }),
      };
    }

    if (post && !post.isLocked) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Post has already been unlocked.',
        }),
      };
    }

    if (post && post.lockUser && post.lockUser.userId !== userId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Post locked owner belongs to another user.',
        }),
      };
    }

    try {
      // update post without updating the updatedAt
      post.update({
        isLocked: false,
        lockUser: null,
      }, {
        silent: true,
      });
    } catch (error) {
      console.log('Unlock Post Error', error);
    }

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();

    await Promise.all(
      sockets.map(async (socket) => {
        await this.send(socket.connectionId, {
          type: 'BROADCAST_UNLOCK',
          message: '',
          meta: {
            id,
            postId: post.postId,
          },
        });
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: 'Unlock post response.',
    };
  }

  async send(connectionId, data) {
    try {
      return await this.socketConnector.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(data),
      }).promise();
    } catch (err) {
      // remove stale connection
      if (err.statusCode === 410) {
        await this.SocketRepository.model.destroy({
          where: {
            connectionId,
          },
        });
      }
    }
  }
}

module.exports = LockPostSocket;
