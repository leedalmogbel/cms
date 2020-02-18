/* eslint-disable class-methods-use-this */

const { Router } = require('express');
const Status = require('http-status');
const { BaseController } = require('../../../infra/core/core');

class CategoriesController extends BaseController {
  constructor() {
    super();
    const router = Router();

    router.get('/', this.injector('ListCategories'), this.index);
    router.get('/:id', this.injector('ShowCategory'), this.show);
    router.post('/', this.injector('CreateCategory'), this.create);
    router.put('/:id', this.injector('SaveCategory'), this.update);

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

  show(req, res, next) {
    const { operation } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = operation.events;

    operation
      .on(SUCCESS, (result) => {
        res
          .status(Status.OK)
          .json(result);
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          message: error.message,
        });
      })
      .on(ERROR, next);

    operation.execute(Number(req.params.id));
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

    operation.execute(Number(req.params.id), req.body);
  }
}

module.exports = CategoriesController;
