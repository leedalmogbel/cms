const AWS = require('aws-sdk');
const Post = require('src/domain/Post');
const { Operation } = require('../../infra/core/core');

class LockPostSocket extends Operation {
  constructor({ PostRepository, UserRepository }) {
    super();

    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
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
        name: `${user.firstName} ${user.lastName}`,
      },
    });

    try {
      await this.PostRepository.update(id, payload);
      await this.PostRepository.getPostById(id);
    } catch (error) {
      console.log('Lock Post Error', error);
    }
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
      await this.PostRepository.getPostById(id);
    } catch (error) {
      console.log('Kick Locked Post Error', error);
    }
  }
}

module.exports = LockPostSocket;
