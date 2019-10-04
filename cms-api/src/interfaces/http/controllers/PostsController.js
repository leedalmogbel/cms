
const { Router } = require('express');
const { BaseController } = require('@brewery/core');
const Status = require('http-status');

class PostsController extends BaseController {
  
  constructor() {
    super();
    const router = Router();
    router.post('/', this.injector('CreatePost'), this.create);
    // router.get('/:id', this.injector('ShowUser'), this.show);
    // router.put('/:id', this.injector('UpdateUser'), this.update);
    // router.delete('/:id', this.injector('DeleteUser'), this.delete);

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

    operation.execute();
  }
}

module.exports = PostsController;
