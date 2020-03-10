const { Operation } = require('../../infra/core/core');

class RecallPost extends Operation {
  constructor({ PostRepository, PostUtils, httpClient }) {
    super();
    this.PostRepository = PostRepository;
    this.PostUtils = PostUtils;
    this.httpClient = httpClient;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    let post;
    try {
      post = await this.PostRepository.getById(id);
    } catch (error) {}

    if (!post) {
      post = await this.PostRepository.getByGeneratedPostId(id);
      if (!post) {
        throw new Error('Post not found');
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
      const { postId } = post;
      const payload = {
        status: 'recalled',
        recall: {
          ...data,
          userId: 'userId' in data ? data.userId : null,
          name: 'name' in data ? data.name : 'PMW Administrator',
        },
      };

      await this.PostRepository.update(post.id, payload);
      await this.pmsIntegrate(postId, data);

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
    console.log(`PMS response for id: ${data.postId}`, res, payload);
  }
}

RecallPost.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = RecallPost;
