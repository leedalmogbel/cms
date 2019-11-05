/* eslint-disable class-methods-use-this */

const { Router } = require('express');
const { BaseController } = require('@brewery/core');
const Status = require('http-status');

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

  index(req, res, next) {
    const { operation } = req;
    const { SUCCESS, ERROR } = operation.events;

    operation
      .on(SUCCESS, (result) => {
        res
          .status(Status.OK)
          .json(result);
      })
      .on(ERROR, next);

    operation.execute(req.query);
  }
}

module.exports = PostsController;
