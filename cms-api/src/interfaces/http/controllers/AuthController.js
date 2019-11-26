
const { Router } = require('express');
const { BaseController } = require('@brewery/core');
const Status = require('http-status');

class AuthController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.post('/', this.injector('Login'), this.login);
    return router;
  }

  login(req, res, next) {
    const { operation } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = operation.events;

    operation
      .on(SUCCESS, (result) => {
        res
          .status(Status.ACCEPTED)
          .json(result);
      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json({
            message: error.message,
          });
      })
      .on(ERROR, (error) => {
        res
          .status(Status.BAD_REQUEST)
          .json({
            message: error.message,
          });
      });

    operation.execute(req.body);
  }
}

module.exports = AuthController;
