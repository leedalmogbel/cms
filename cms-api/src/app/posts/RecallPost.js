const AWS = require('aws-sdk');
const { Operation } = require('../../infra/core/core');

class RecallPost extends Operation {
  constructor({
    PostRepository,
    SocketRepository,
    UserRepository,
    NotificationRepository,
    httpClient,
    NotificationSocket,
    HistoryRepository,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.SocketRepository = SocketRepository;
    this.UserRepository = UserRepository;
    this.NotificationRepository = NotificationRepository;
    this.httpClient = httpClient;
    this.NotificationSocket = NotificationSocket;
    this.HistoryRepository = HistoryRepository;
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
      const { postId } = post;

      // format name
      let name = 'name' in data ? data.name : null;
      const firstName = 'firstName' in data ? data.firstName : 'PMW';
      const lastName = 'lastName' in data ? data.lastName : 'Moderator';

      if (!('name' in data) || !data.name) {
        name = `${firstName} ${lastName}`;
      }

      const payload = {
        status: 'recalled',
        recalledAt,
        recall: {
          ...data,
          userId: 'userId' in data ? data.userId : null,
          name,
        },
      };

      let updatedPost = await this.PostRepository.update(post.id, payload);
      updatedPost = updatedPost.toJSON();

      // update firehose and pms stream
      await this.firehoseIntegrate(updatedPost, action);
      if (action === 'cms') {
        await this.pmsIntegrate(postId, data);
      }

      // notify all user of recalled post from pmw
      if (action === 'pmw') {
        await this.notifyUsers({
          type: 'NOTIFICATION',
          message: `${name} recalled a post ${post.title}`,
          meta: {
            id: post.id,
            postId,
            name,
          },
        });
      }

      let user;
      user = {
        firstName,
        lastName,
      };

      if (post.userId !== null) {
        user = await this.UserRepository.getUserById(post.userId);
        user = user.toJSON();
      }

      updatedPost = {
        ...updatedPost,
        CurrentUser: user,
      };

      await this.HistoryRepository.add({
        parentId: post.id,
        type: 'post',
        meta: updatedPost,
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
    console.log(`PMS response for id: ${postId}`, res, payload);
  }

  async firehoseIntegrate(post, action) {
    if (post.status !== 'recalled') return;
    console.time('FIREHOSE RECALL INTEGRATION');

    console.log('test123', post);

    const { postId, recall, recalledAt } = post;
    
    const payload = {
      applicationName: null,
      applicationUniqueId: null,
      buildVersionRelease: null,
      sessionId: null,
      cmsUserId: action === 'cms' ? recall.userId : null,
      pmsWebUserId: action === 'pmw' ? recall.userId : null,
      ipAddress: null,
      actionTake: null,
      clickedContent: null,
      eventTimestamp: recalledAt,
      postId,
      reasons: recall.reasons,
      description: recall.description,
    };

    const firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });

    const fres = await firehose.putRecord({
      DeliveryStreamName: process.env.FIREHOSE_POST_STREAM_RECALL,
      Record: {
        Data: JSON.stringify(payload),
      },
    }).promise();

    console.timeEnd('FIREHOSE RECALL INTEGRATION');
    console.log(`Firehose response for id: ${post.postId}`, fres, payload);
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
