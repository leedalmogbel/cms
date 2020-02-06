const Post = require('src/domain/Post');
const uuidv1 = require('uuid/v1');
const { Operation } = require('../../infra/core/core');

class PublishPost extends Operation {
  constructor({ PostRepository, UserRepository, PostUtils }) {
    super();
    this.PostRepository = PostRepository;
    this.UserRepository = UserRepository;
    this.PostUtils = PostUtils;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {
      return this.emit(
        VALIDATION_ERROR,
        new Error('Post not found'),
      );
    }

    // do not process multiple location if scheduled post
    if ('scheduledAt' in data) {
      if ('locations' in data && data.locations.length) {
        data = {
          ...data,
          ...data.locations[0],
        };
      }

      const res = await this.publish(id, data);
      return this.emit(SUCCESS, {
        results: { ids: [res.id] },
        meta: {},
      });
    }

    // if update post proceed to publish
    if (post.publishedAt) {
      const res = await this.publish(id, data);
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
        const { placeId, isGeofence } = loc;

        data = {
          ...data,
          placeId,
          isGeofence,
        };

        // set initial post id to first location
        id = index > 0 ? null : id;

        // create initial post for succeeding locations
        if (!id) {
          const payload = new Post({
            status: 'initial',
            postId: `kapp-cms-${uuidv1()}`,
          });

          const newPost = await this.PostRepository.add(payload);
          id = newPost.id;
        }

        const post = await this.publish(id, data);
        return post.id;
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
      throw new Error('User not found');
    }
  }

  async publish(id = null, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let oldPost;

    try {
      oldPost = await this.PostRepository.getById(id);
      oldPost = oldPost.toJSON();
    } catch (error) {
      throw new Error('Post not found');
    }

    data.status = await this.getStatus(data);
    if (data.status === 'published') {
      data.publishedAt = new Date().toISOString();
    }

    if ('scheduledAt' in data) {
      data.scheduledAt = new Date(data.scheduledAt).toISOString();
    }

    data = await this.PostUtils.build(data);
    data.validateData();

    await this.PostRepository.update(id, data);
    let post = await this.PostRepository.getPostById(id);
    post = post.toJSON();

    if (post.scheduledAt) {
      return post;
    }

    await this.PostUtils.postNotifications(oldPost, post);
    await this.PostUtils.firehoseIntegrate(oldPost, post);
    await this.PostUtils.pmsIntegrate(post);

    return post;
  }
}

PublishPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = PublishPost;
