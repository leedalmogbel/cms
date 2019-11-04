
const { Router } = require('express');
const { BaseController } = require('@brewery/core');

class PostsController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.get('/', this.injector('ListPosts'), this.index);
    router.get('/:id', this.injector('ShowPost'), this.show);
    router.post('/', this.injector('CreatePostDraft'), this.create);
    router.put('/:id', this.injector('SavePost'), this.update);
    router.post('/:id/publish', this.injector('PublishPost'), this.update);

    return router;
  }
}

module.exports = PostsController;
