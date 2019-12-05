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
    router.post('/', this.injector('CreateInitialPost'), this.create);
    router.put('/:id', this.injector('SavePost'), this.update);
    router.post('/:id/draft', this.injector('SaveDraftPost'), this.update);
    router.post('/:id/approve', this.injector('ApprovePost'), this.update);
    router.post('/:id/revise', this.injector('RevisePost'), this.update);
    router.post('/:id/publish', this.injector('PublishPost'), this.update);
    router.post('/:id/comment', this.injector('AddPostComment'), this.update);

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

module.exports = PostsController;
