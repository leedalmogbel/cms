
const { Router } = require('express');
const { BaseController } = require('@brewery/core');
const Status = require('http-status');

class AdvisoriesController extends BaseController {
  
  constructor() {
    super();
    const router = Router();
    router.get('/', this.injector('ListAdvisory'), this.index);
    router.post('/', this.injector('CreateAdvisory'), this.create);
    router.get('/:id', this.injector('ShowAdvisory'), this.show);
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

module.exports = AdvisoriesController;