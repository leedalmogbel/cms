const History = require('src/domain/History');
const { Operation } = require('../../infra/core/core');

class CreateHistory extends Operation {
  constructor({ HistoryRepository }) {
    super();
    this.HistoryRepository = HistoryRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      const payload = new History(data);
      const history = await this.HistoryRepository.add(payload);

      this.emit(SUCCESS, {
        results: history,
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

CreateHistory.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateHistory;
