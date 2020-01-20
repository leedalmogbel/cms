const { Operation } = require('../../infra/core/core');

class ShowAgenda extends Operation {
  constructor({ AgendaRepository }) {
    super();
    this.AgendaRepository = AgendaRepository;
  }

  async execute(id) {
    const { SUCCESS, NOT_FOUND } = this.events;

    try {
      const agenda = await this.AgendaRepository.getAgendaById(id);

      if (!agenda || !agenda.isActive) {
        throw new Error();
      }

      this.emit(SUCCESS, {
        results: agenda,
        meta: {},
      });
    } catch (error) {
      error.message = 'Agenda not found';
      this.emit(NOT_FOUND, error);
    }
  }
}

ShowAgenda.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ShowAgenda;
