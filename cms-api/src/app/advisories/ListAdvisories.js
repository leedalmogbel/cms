const { Operation } = require('@brewery/core');

class ListAdvisories extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const advisories = await this.AdvisoryRepository.getAll({});

      this.emit(SUCCESS, {data: {advisories}});
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

ListAdvisories.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListAdvisories;
    
