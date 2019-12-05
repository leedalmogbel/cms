const { Operation } = require('@brewery/core');
const AWS = require('aws-sdk');
const Post = require('src/domain/Post');
const PmsPost = require('src/domain/pms/Post');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');

class PostUtils extends Operation {
  constructor({
    PostRepository,
    NotificationRepository,
    UserRepository,
    GetLocation,
    NotificationSocket,
    httpClient,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.NotificationRepository = NotificationRepository;
    this.NotificationSocket = NotificationSocket;
    this.GetLocation = GetLocation;
    this.httpClient = httpClient;
  }

  async build(data) {
    if ('placeId' in data && data.placeId) {
      const {
        locationDetails,
        locationAddress,
      } = await this.GetLocation.execute(data.placeId);

      data = {
        ...data,
        locationDetails,
        locationAddress,
      };
    }

    return new Post(data);
  }

  async firehoseIntegrate(data) {
    if (data.status !== 'published') return;

    const firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });

    const payload = PublistPostStreams(data);
    const fres = await firehose.putRecord({
      DeliveryStreamName: 'AddPost-cms',
      Record: {
        Data: JSON.stringify(payload),
      },
    }).promise();

    console.log(`Firehose response for id: ${data.postId}`, fres, payload);
  }

  async pmsIntegrate(data) {
    if (data.status !== 'published') return;

    const payload = PmsPost(data);
    const pres = await this.httpClient.post(
      process.env.PMS_POST_ENDPOINT,
      payload,
      {
        access_token: process.env.PMS_POST_TOKEN,
      },
    );

    console.log(`PMS response for id: ${data.postId}`, pres, payload);
  }

  async saveNotification({ userId, message, meta = {} }) {
    await this.NotificationSocket
      .notifyUser(userId, {
        message,
        meta,
      });

    await this.NotificationRepository.add({
      userId,
      message,
      meta: {},
      active: 1,
    });
  }

  async postNotifications(prevPost, updatedPost) {
    let { contributors: prevContributors } = prevPost;
    let { contributors } = updatedPost;

    const { id, postId } = updatedPost;
    const meta = {
      id,
      postId,
    };

    contributors = contributors || {};
    prevContributors = prevContributors || {};

    let author = await this.UserRepository.getUserById(updatedPost.userId);
    author = author.toJSON();

    if ('editor' in contributors && contributors.editor) {
      const editorId = contributors.editor.id;

      // send notification to removed editor
      let prevEditorId;
      if ('editor' in prevContributors && prevContributors.editor) {
        prevEditorId = prevContributors.editor.id;

        if (prevEditorId !== editorId) {
          await this.saveNotification({
            userId: prevEditorId,
            message: `You are removed as an editor for Post "${updatedPost.title}"`,
            meta,
          });
        }
      }

      // notify editor only if the editor is not
      // the previous editor
      if (editorId !== prevEditorId) {
        // if author role is writer notification
        // message is for approval
        let message = `You are assigned as an editor for Post "${updatedPost.title}"`;
        if (author.role.title === 'writer' || (author.role.title === 'editor' && author.id !== editorId)) {
          message = `Post "${updatedPost.title}" is assigned to you for approval.`;
        }

        await this.saveNotification({
          userId: editorId,
          message,
          meta,
        });
      }
    }

    if ('writers' in contributors && contributors.writers.length) {
      const writerId = contributors.writers[0].id;

      // send notification to removed writer
      let prevWriterId;
      if ('writers' in prevContributors && prevContributors.writers.length) {
        prevWriterId = prevContributors.writers[0].id;

        if (prevWriterId !== writerId) {
          this.saveNotification({
            userId: prevWriterId,
            message: `You are removed as an editor for Post "${updatedPost.title}"`,
            meta,
          });
        }
      }

      // notify writer only if the writer is not
      // the previous writer
      if (writerId !== prevWriterId) {
        await this.saveNotification({
          userId: writerId,
          message: `You are assigned as a writer for Post "${updatedPost.title}"`,
          meta,
        });
      }
    }
  }
}

module.exports = PostUtils;
