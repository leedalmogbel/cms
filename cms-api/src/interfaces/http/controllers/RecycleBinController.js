/* eslint-disable class-methods-use-this */

const { Router } = require('express');
const Status = require('http-status');
const { BaseController } = require('../../../infra/core/core');

class RecycleBinController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.get('/', this.injector('RecycleBinListPosts'), this.index);
    router.post('/restore', this.injector('Restore'), this.update);

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

  update(req, res, next) {
    const { operation } = req;
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = operation.events;

    operation
      .on(SUCCESS, (result) => {
        res
          .status(Status.ACCEPTED)
          .json(result);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          message: error.message,
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          message: error.message,
        });
      })
      .on(ERROR, next);

    operation.execute(req.body);
  }
}

module.exports = RecycleBinController;
