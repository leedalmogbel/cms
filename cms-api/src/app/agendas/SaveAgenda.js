const Agenda = require('src/domain/Agenda');
const { Operation } = require('../../infra/core/core');

class SaveAgenda extends Operation {
  constructor({ AgendaRepository }) {
    super();
    this.AgendaRepository = AgendaRepository;
  }

  async execute(id, data) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND,
    } = this.events;

    try {
      await this.AgendaRepository.getById(id);
    } catch (error) {
      error.message = 'Agenda not found';
      return this.emit(NOT_FOUND, error);
    }

    try {
      await this.AgendaRepository.update(id, data);

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

SaveAgenda.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = SaveAgenda;
