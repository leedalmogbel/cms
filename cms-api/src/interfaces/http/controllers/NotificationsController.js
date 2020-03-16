
const { Router } = require('express');
const Status = require('http-status');
const { BaseController } = require('../../../infra/core/core');

class NotificationsController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.get('/', this.injector('ListNotifications'), this.index);
    router.post('/', this.injector('UpdateNotification'), this.create);

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

  create(req, res, next) {
    const { operation } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = operation.events;

    operation
      .on(SUCCESS, (result) => {
        res
          .status(Status.CREATED)
          .json(result);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          message: error.message,
        });
      })
      .on(ERROR, next);

    operation.execute(req.body);
  }
}

module.exports = NotificationsController;
