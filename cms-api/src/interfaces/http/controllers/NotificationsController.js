
const { Router } = require('express');
const { BaseController } = require('@brewery/core');
const Status = require('http-status');

class NotificationsController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.get('/', this.injector('ListNotifications'), this.index);
    router.post('/', this.injector('CreateNotification'), this.create);
    router.get('/:id', this.injector('ShowNotification'), this.show);
    router.put('/:id', this.injector('UpdateNotification'), this.update);
    router.delete('/:id', this.injector('DeleteNotification'), this.delete);

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
