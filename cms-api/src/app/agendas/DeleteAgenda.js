const { Operation } = require('../../infra/core/core');

class DeleteAgenda extends Operation {
  constructor({ AgendaRepository }) {
    super();
    this.AgendaRepository = AgendaRepository;
  }

  async execute(id) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.events;

    try {
      const agenda = await this.AgendaRepository.getAgendaById(id);

      if (!agenda || !agenda.isActive) {
        throw new Error();
      }
    } catch (error) {
      error.message = 'Agenda not found';
      this.emit(NOT_FOUND, error);
    }

    try {
      await this.AgendaRepository.update(id, {
        isActive: 0,
      });

      this.emit(SUCCESS, {
        results: { id },
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

DeleteAgenda.setEvents(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteAgenda;
