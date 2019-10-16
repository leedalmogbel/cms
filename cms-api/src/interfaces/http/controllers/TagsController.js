
const { Router } = require('express');
const { BaseController } = require('@brewery/core');

class TagsController extends BaseController {
  constructor() {
    super();
    const router = Router();
    router.get('/', this.injector('ListTags'), this.index);
    router.post('/', this.injector('CreateTag'), this.create);

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

module.exports = TagsController;
