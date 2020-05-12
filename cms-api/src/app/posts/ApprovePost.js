const Post = require('src/domain/Post');
const { Operation } = require('../../infra/core/core');

class ApprovePost extends Operation {
  constructor({
    PostRepository, UserRepository, PostUtils, HistoryRepository,
  }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.PostUtils = PostUtils;
    this.HistoryRepository = HistoryRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      return this.emit(NOT_FOUND, new Error('Post not found'));
    }

    data.status = await this.getStatus(data);

    // do not process multiple locations on these statuses
    if (data.status === 'scheduled'
      || data.status === 'embargo') {
      const res = await this.publish(id, data);
      return this.emit(SUCCESS, {
        results: { ids: [res.id] },
        meta: {},
      });
    }

    // republish post
    if (data.status === 'published' && post.publishedAt) {
      if ('locations' in data && data.locations.length) {
        data = {
          ...data,
          ...data.locations[0], // add placeid & geofence field based on locations
        };
      }

      let user = await this.UserRepository.getUserById(data.userId);
      user = user.toJSON();

      let res = await this.publish(id, data);
      res = {
        ...res,
        CurrentUser: user,
      };

      if (!res.approval) {
        await this.HistoryRepository.add({
          parentId: res.id,
          type: 'post',
          meta: res,
        });
      }

      return this.emit(SUCCESS, {
        results: { ids: [res.id] },
        meta: {},
      });
    }

    // process publish multiple locations
    const { locations } = data;

    if (!locations || typeof locations === 'undefined') {
      return this.emit(
        VALIDATION_ERROR,
        new Error('Invalid post location'),
      );
    }

    await Promise.all(
      locations.map(async (loc, index) => {
        const { placeId, isGeofence, address } = loc;
        let { postId } = post;

        // set initial post id to first location
        id = index > 0 ? null : id;

        // create initial post for succeeding locations
        if (!id) {
          postId = await this.PostUtils.generateUid();
          const payload = new Post({
            status: 'initial',
            postId,
          });

          const newPost = await this.PostRepository.add(payload);
          id = newPost.id;
        }

        data = {
          ...data,
          postId,
          placeId,
          address,
          isGeofence,
        };

        const res = await this.publish(id, data);
        return res.id;
      }),
    ).then((ids) => {
      this.emit(SUCCESS, {
        results: { ids },
        meta: {},
      });
    }).catch((errors) => {
      this.emit(VALIDATION_ERROR, errors);
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

      if ('isEmbargo' in data && data.isEmbargo) {
        return 'embargo';
      }

      if (data.scheduledAt && !data.publishedAt && !data.isPublishedImmediately) {
        return 'scheduled';
      }

      return 'published';
    } catch (error) {
      this.emit(NOT_FOUND, new Error('User not found'));
    }
  }

  async publish(id, data) {
    let oldPost;

    try {
      oldPost = await this.PostRepository.getById(id);
      oldPost = oldPost.toJSON();
    } catch (error) {
      throw new Error('Post not found');
    }

    if (data.status === 'published') {
      data.publishedAt = new Date().toISOString();
    }

    if (data.status === 'scheduled' && 'scheduledAt' in data) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    }

    data = await this.PostUtils.build(data);
    data.validateData();

    await this.PostRepository.update(id, data);
    let post = await this.PostRepository.getPostById(id);
    post = post.toJSON();

    if (post.status === 'scheduled') {
      return post;
    }

    const {
      postId,
      userId,
      title,
      contributors,
      status,
    } = post;

    const {
      writers,
      editor,
    } = contributors;

    const author = await this.UserRepository.getById(userId);
    const authorName = `${author.firstName} ${author.lastName}`;

    // approved post notification
    if (status === 'published'
      && userId
      && writers
      && writers.length) {
      const writerId = writers[0].id;
      const message = `${authorName} approve your post ${title}`;

      await this.PostUtils.saveNotification({
        userId: writerId,
        message,
        meta: { id, postId },
      });

      await this.HistoryRepository.add({
        parentId: post.id,
        type: 'post',
        meta: post,
      });

      post.approval = true;
    }

    // if writer revised the post resend approval notification
    if (status === 'for-approval'
      && editor
      && Object.entries(editor).length !== 0) {
      const editorId = editor.id;
      const message = `${authorName} re-submitted a post for approval ${title}`;

      await this.PostUtils.saveNotification({
        userId: editorId,
        message,
        meta: { id, postId },
      });
    }

    await this.PostUtils.firehoseIntegrate(oldPost, post);
    await this.PostUtils.pmsIntegrate(post);

    return post;
  }
}

ApprovePost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ApprovePost;
