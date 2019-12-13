const AWS = require('aws-sdk');
const Post = require('src/domain/Post');
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
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    const { connectionId } = event.requestContext;
    const { data: { id, userId } } = JSON.parse(event.body);

    // validate userId
    const user = await this.UserRepository.getUserById(userId);
    if (!user) {
      return {
        statusCode: 500,
        headers,
        body: 'Invalid user id',
      };
    }

    const name = `${user.firstName} ${user.lastName}`;

    // validate post
    const post = await this.PostRepository.getById(id);
    if (!post) {
      return {
        statusCode: 500,
        headers,
        body: 'Invalid post id',
      };
    }

    if (post.isLocked) return;

    const payload = new Post({
      isLocked: true,
      lockUser: {
        connectionId,
        userId,
        name,
      },
    });

    try {
      await this.PostRepository.update(id, payload);
    } catch (error) {
      console.log('Lock Post Error', error);
    }

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();
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
    });
  }

  async kick(event) {
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    const { connectionId } = event.requestContext;
    const { data: { id, userId } } = JSON.parse(event.body);

    // validate userId
    const user = await this.UserRepository.getUserById(userId);
    if (!user) {
      return {
        statusCode: 500,
        headers,
        body: 'Invalid user id',
      };
    }

    const name = `${user.firstName} ${user.lastName}`;

    // validate post
    const post = await this.PostRepository.getById(id);
    if (!post) {
      return {
        statusCode: 500,
        headers,
        body: 'Invalid post id',
      };
    }

    if (!post.isLocked) return;

    const payload = new Post({
      isLocked: true,
      lockUser: {
        connectionId,
        userId,
        name: `${user.firstName} ${user.lastName}`,
      },
    });

    try {
      await this.PostRepository.update(id, payload);
    } catch (error) {
      console.log('Kick Locked Post Error', error);
    }

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();
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
    });
  }

  async unlock(event) {
    const headers = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    };

    const { data: { id } } = JSON.parse(event.body);

    // validate post
    const post = await this.PostRepository.getById(id);
    if (!post) {
      return {
        statusCode: 500,
        headers,
        body: 'Invalid post id',
      };
    }

    if (!post.isLocked) return;

    const payload = new Post({
      isLocked: false,
      lockUser: null,
    });

    try {
      await this.PostRepository.update(id, payload);
    } catch (error) {
      console.log('Unlock Post Error', error);
    }

    // send post lock broadcast to all connections
    const sockets = await this.SocketRepository.getAll();
    sockets.map(async (socket) => {
      await this.send(socket.connectionId, {
        type: 'BROADCAST_UNLOCK',
        message: '',
        meta: {
          id,
          postId: post.postId,
        },
      });
    });
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
