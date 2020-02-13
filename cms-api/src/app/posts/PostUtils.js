const AWS = require('aws-sdk');
const Post = require('src/domain/Post');
const PmsPost = require('src/domain/pms/Post');
const PublishPostStreams = require('src/domain/streams/PublishPostStreams');
const UpdatePostStreams = require('src/domain/streams/UpdatePostStreams');
const uuidv4 = require('uuid/v4');
const { Operation } = require('../../infra/core/core');

class PostUtils extends Operation {
  constructor({
    PostRepository,
    NotificationRepository,
    UserRepository,
    BaseLocation,
    NotificationSocket,
    httpClient,
    PostTagRepository,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.NotificationRepository = NotificationRepository;
    this.NotificationSocket = NotificationSocket;
    this.BaseLocation = BaseLocation;
    this.httpClient = httpClient;
    this.PostTagRepository = PostTagRepository;
  }

  async build(data) {
    if ('tagsAdded' in data && data.tagsAdded) {
      await data.tagsAdded.forEach((tag) => {
        this.savePostTags({
          postId: data.id,
          name: tag[0],
        });
      });
    }

    if ('tagsRetained' in data && data.tagsRetained) {
      await data.tagsRetained.forEach((tag) => {
        this.savePostTags({
          postId: data.id,
          name: tag[0],
        });
      });
    }

    if ('tagsOriginal' in data && data.tagsOriginal) {
      await data.tagsOriginal.forEach(async (tag) => {
        let postTagId = await this.PostTagRepository.getPostIdByTagName(tag[0]);

        if (postTagId) {
          postTagId = postTagId.toJSON();
          this.PostTagRepository.deletePostTagById(postTagId.id);
        }
      });
    }

    if ('tagsRemoved' in data && data.tagsRemoved) {
      await data.tagsRemoved.forEach(async (tag) => {
        let postTagId = await this.PostTagRepository.getPostIdByTagName(tag[0]);

        if (postTagId) {
          postTagId = postTagId.toJSON();
          this.PostTagRepository.deletePostTagById(postTagId.id);
        }
      });
    }


    if ('placeId' in data && data.placeId) {
      const loc = await this.BaseLocation.detail(data.placeId);
      loc.isGeofence = data.isGeofence;

      data = {
        ...data,
        locations: [loc],
        isActive: 1,
      };
    }

    return new Post(data);
  }

  async firehoseIntegrate(oldPost, post) {
    if (post.status !== 'published') return;
    console.time('FIREHOSE INTEGRATION');

    let DeliveryStreamName = process.env.FIREHOSE_POST_STREAM_ADD;
    let payload = PublishPostStreams(post);

    // if republished or update post send to updatepost-cms stream
    if (oldPost.publishedAt) {
      DeliveryStreamName = process.env.FIREHOSE_POST_STREAM_UPDATE;
      payload = UpdatePostStreams(post, oldPost);
    }

    const firehose = new AWS.Firehose({
      apiVersion: '2015-08-04',
    });

    const fres = await firehose.putRecord({
      DeliveryStreamName,
      Record: {
        Data: JSON.stringify(payload),
      },
    }).promise();

    console.timeEnd('FIREHOSE INTEGRATION');
    console.log(`Firehose response for id: ${post.postId}`, fres, payload);
  }

  async pmsIntegrate(data) {
    if (data.status !== 'published') return;
    console.time('PMS INTEGRATION');

    const payload = PublishPostStreams(data);
    const pres = await this.httpClient.post(
      process.env.PMS_POST_ENDPOINT,
      payload,
      {
        access_token: process.env.PMS_POST_TOKEN,
      },
    );

    console.timeEnd('PMS INTEGRATION');
    console.log(`PMS response for id: ${data.postId}`, pres, payload);
  }

  async saveNotification({ userId, message, meta = {} }) {
    const date = new Date().toISOString();

    await this.NotificationSocket
      .notifyUser(userId, {
        type: 'NOTIFICATION',
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

  async savePostTags({ postId, name }) {
    const exists = await this.PostTagRepository.getTagByName(name);

    if (!exists) {
      await this.PostTagRepository.add({
        postId,
        name,
      });
    }
  }

  async postNotifications(oldPost, updatedPost) {
    const {
      editor,
      writers,
    } = updatedPost.contributors || {};

    const {
      editor: oldEditor,
      writers: oldWriters,
    } = oldPost.contributors || {};

    const { id, postId } = updatedPost;
    const meta = {
      id,
      postId,
    };

    let author = await this.UserRepository.getUserById(updatedPost.userId);
    author = author.toJSON();
    author.name = `${author.firstName} ${author.lastName}`;

    if (editor && Object.entries(editor).length !== 0) {
      if (oldEditor && oldEditor.id && oldEditor.id !== editor.id) {
        // send notification to removed editor
        await this.saveNotification({
          userId: oldEditor.id,
          message: `You are removed as an editor for Post "${updatedPost.title}"`,
          meta: {
            ...meta,
            name: `${oldEditor.firstName} ${oldEditor.lastName}`,
          },
        });

        // send notification to current editor
        await this.saveNotification({
          userId: editor.id,
          message: `${oldEditor.firstName} ${oldEditor.lastName} assigned you as editor for post ${updatedPost.title}`,
          meta: {
            ...meta,
            name: `${editor.firstName} ${editor.lastName}`,
          },
        });
      }

      // send writer for approval notification
      if (author.id !== editor.id && writers && writers.length && Object.entries(writers[0]).length !== 0) {
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

    if (writers && writers.length && Object.entries(writers[0]).length !== 0) {
      const writer = writers[0];
      const writerId = writer.id;

      // skip notification if writer is the author
      if (author.id === writer.id) return;

      // send notification to removed writer
      let oldWriterId;
      if (oldWriters && oldWriters.length) {
        const oldWriter = oldWriters[0];
        oldWriterId = oldWriter.id;

        if (oldWriterId && oldWriterId !== writer.id) {
          this.saveNotification({
            userId: oldWriterId,
            message: `You are removed as a writer for Post "${updatedPost.title}"`,
            meta: {
              ...meta,
              name: `${oldWriters[0].firstName} ${oldWriters[0].lastName}`,
            },
          });
        }
      }

      // skip the same writer
      if (oldWriterId === writer.id) return;

      let editorName;
      if (editor) {
        editorName = `${editor.firstName} ${editor.lastName}`;
      }

      if (writerId) {
        await this.saveNotification({
          userId: writerId,
          message: `${editorName} assigned you as a writer for post ${updatedPost.title}`,
          meta: {
            ...meta,
            name: `${writer.firstName} ${writer.lastName}`,
          },
        });
      }
    }
  }

  async generateUid() {
    const postId = `kapp-cms-${uuidv4()}`;

    const posts = await this.PostRepository.getAll({
      where: {
        postId,
      },
    });

    if (posts && posts.length) {
      return this.generateUid();
    }

    return postId;
  }
}

module.exports = PostUtils;
