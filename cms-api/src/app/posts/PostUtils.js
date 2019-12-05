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
    const date = new Date().toISOString();

    await this.NotificationSocket
      .notifyUser(userId, {
        message,
        meta: {
          ...meta,
          date,
        },
      });

    await this.NotificationRepository.add({
      userId,
      message,
      meta: {
        ...meta,
        date,
      },
      active: 1,
    });
  }

  async postNotifications(prevPost, updatedPost) {
    const {
      editor,
      writers,
    } = updatedPost.contributors || {};

    const {
      editor: prevEditor,
      writers: prevWriters,
    } = prevPost.contributors || {};

    const { id, postId } = updatedPost;
    const meta = {
      id,
      postId,
    };

    let author = await this.UserRepository.getUserById(updatedPost.userId);
    author = author.toJSON();
    author.name = `${author.firstName} ${author.lastName}`;

    if (editor) {
      if (prevEditor && prevEditor.id !== editor.id) {
        // send notification to removed editor
        await this.saveNotification({
          userId: prevEditor.id,
          message: `You are removed as an editor for Post "${updatedPost.title}"`,
          meta: {
            ...meta,
            name: `${prevEditor.firstName} ${prevEditor.lastName}`,
          },
        });

        // send notification to current editor
        await this.saveNotification({
          userId: editor.id,
          message: `${prevEditor.firstName} ${prevEditor.lastName} assigned you as editor for post ${updatedPost.title}`,
          meta: {
            ...meta,
            name: `${editor.firstName} ${editor.lastName}`,
          },
        });
      }

      // send writer for approval notification
      if (author.id !== editor.id && writers && writers.length) {
        const writerName = `${writers[0].firstName} ${writers[0].lastName}`;
        const message = `${writerName} submitted a post for approval ${updatedPost.title}`;
        meta.name = writerName;

        await this.saveNotification({
          userId: editor.id,
          message,
          meta,
        });
      }
    }

    if (writers && writers.length) {
      const writer = writers[0];

      // skip notification if writer is the author
      if (author.id === writer.id) return;

      // send notification to removed writer
      let prevWriterId;
      if (prevWriters && prevWriters.length) {
        const prevWriter = prevWriters[0];
        prevWriterId = prevWriter.id;

        if (prevWriterId !== writer.id) {
          this.saveNotification({
            userId: prevWriterId,
            message: `You are removed as a writer for Post "${updatedPost.title}"`,
            meta: {
              ...meta,
              name: `${prevWriters[0].firstName} ${prevWriters[0].lastName}`,
            },
          });
        }
      }

      // skip the same writer
      if (prevWriterId === writer.id) return;

      let editorName;
      if (editor) {
        editorName = `${editor.firstName} ${editor.lastName}`;
      }

      await this.saveNotification({
        userId: writer.id,
        message: `${editorName} assigned you as a writer for post ${updatedPost.title}`,
        meta: {
          ...meta,
          name: `${writer.firstName} ${writer.lastName}`,
        },
      });
    }
  }
}

module.exports = PostUtils;
