const { Operation } = require('../../infra/core/core');

class ListAgendas extends Operation {
  constructor({ AgendaRepository }) {
    super();
    this.AgendaRepository = AgendaRepository;
  }

  async execute(args) {
    const { SUCCESS, ERROR } = this.events;

    try {
      const agendas = await this.AgendaRepository.getPosts(args);
      const total = await this.AgendaRepository.count(args);

      this.emit(SUCCESS, {
        results: agendas,
        meta: {
          total,
        },
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

ListAgendas.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = ListAgendas;
