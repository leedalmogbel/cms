const { Operation } = require('@brewery/core');
const PublistPostStreams = require('src/domain/streams/PublishPostStreams');
const PmsPost = require('src/domain/pms/Post');
const AWS = require('aws-sdk');
const util = require('util');

class PublishPost extends Operation {
  constructor({
    PostRepository, SavePost, httpClient, UserRepository, NotificationSocket,
  }) {
    super();

    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
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

  async postNotifications(prev, updated) {
    const { contributors } = updated;
    const { contributors: prevContributors } = prev;

    const ASSIGN_USER = 'You are assigned as %s for Post: %s';
    const REMOVE_USER = 'You are removed as %s for Post: %s';

    let editor;
    let writer;
    let prevEditor;
    let prevWriter;

    // send notification to newly assigned editor
    if (contributors && 'editor' in contributors && contributors.editor) {
      editor = contributors.editor.id;
      this.NotificationSocket.notifyUser(editor, {
        message: util.format(ASSIGN_USER, 'editor', updated.title),
      });
    }

    // send notification to removed editor
    if (prevContributors && 'editor' in prevContributors && prevContributors.editor) {
      prevEditor = prevContributors.editor.id;

      if (prevEditor !== editor) {
        this.NotificationSocket.notifyUser(prevEditor, {
          message: util.format(REMOVE_USER, 'editor', updated.title),
        });
      }
    }

    // send notification to newly assigned writer
    if (contributors && 'writers' in contributors && contributors.writers.length) {
      writer = contributors.writers[0].id;
      this.NotificationSocket.notifyUser(writer, {
        message: util.format(ASSIGN_USER, 'writer', updated.title),
      });
    }

    // send notification to removed writer
    if (prevContributors && 'writers' in prevContributors && prevContributors.writers.length) {
      prevWriter = prevContributors.writers[0].id;

      if (prevWriter !== writer) {
        this.NotificationSocket.notifyUser(prevWriter, {
          message: util.format(REMOVE_USER, 'writer', updated.title),
        });
      }
    }
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
