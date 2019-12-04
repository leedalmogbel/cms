const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');
const util = require('util');

class PublishPost extends Operation {
  constructor({
    SavePost,
    httpClient,
    PostRepository,
    UserRepository,
    NotificationRepository,
    NotificationSocket,
  }) {
    super();

    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.NotificationRepository = NotificationRepository;
    this.SavePost = SavePost;
    this.httpClient = httpClient;
    this.NotificationSocket = NotificationSocket;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let prevPost;
    try {
      prevPost = await this.PostRepository.getById(id);
    } catch (error) {
      error.message = 'Post not found';
      return this.emit(NOT_FOUND, error);
    }

    data.status = await this.getStatus(data);
    if (data.status === 'published') {
      data.publishedAt = new Date().toISOString();
    }

    if ('scheduledAt' in data) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    }

    try {
      data = await this.SavePost.build(data);
      data.validateData();
    } catch (error) {
      return this.emit(VALIDATION_ERROR, error);
    }

    try {
      await this.PostRepository.update(id, data);
      const post = await this.PostRepository.getPostById(id);

      if (post.scheduledAt) {
        return this.emit(SUCCESS, {
          results: { id },
          meta: {},
        });
      }

      await this.firehoseIntegrate(post.toJSON());
      await this.pmsIntegrate(post.toJSON());
      await this.postNotifications(prevPost, post);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }

  async firehoseIntegrate(data) {
    // skip if not yet published
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
    // skip if not yet published
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
        if (author.role.title === 'writer') {
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

  async getStatus(data) {
    const { NOT_FOUND } = this.events;

    try {
      let user = await this.UserRepository.getUserById(data.userId);
      user = user.toJSON();

      if (user.role.title === 'writer') {
        return 'for-approval';
      }

      if (data.scheduledAt && !data.publishedAt) {
        return 'scheduled';
      }

      return 'published';
    } catch (error) {
      error.message = 'User not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

PublishPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishPost;
