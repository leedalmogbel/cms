const { Operation } = require('../../infra/core/core');

class ListHistories extends Operation {
  constructor({ HistoryRepository }) {
    super();
    this.HistoryRepository = HistoryRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const histories = await this.HistoryRepository.getHistories(args);

      this.emit(SUCCESS, {
        results: histories,
        meta: {
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListHistories.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListHistories;
