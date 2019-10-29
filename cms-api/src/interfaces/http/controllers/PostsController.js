
const { Router } = require('express');
const { BaseController } = require('@brewery/core');
const Status = require('http-status');

class PostsController extends BaseController {
  constructor() {
    super();
    const router = Router();
    router.get('/', this.injector('ListPosts'), PostsController.index);

    return router;
  }

  static async index(req, res, next) {
    const { operation } = req;

    try {
      const result = await operation.execute();

      res.status(Status.OK)
        .json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PostsController;
