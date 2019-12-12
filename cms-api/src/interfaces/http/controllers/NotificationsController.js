
const { Router } = require('express');
const Status = require('http-status');
const { BaseController } = require('../../../infra/core/core');

class NotificationsController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.get('/', this.injector('ListNotifications'), this.index);
    router.put('/:id', this.injector('UpdateNotification'), this.update);

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

module.exports = NotificationsController;
