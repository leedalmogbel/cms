const Agenda = require('src/domain/Agenda');
const { Operation } = require('../../infra/core/core');

class CreateAgenda extends Operation {
  constructor({ AgendaRepository }) {
    super();
    this.AgendaRepository = AgendaRepository;
  }

  async execute(data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.events;

    try {
      const payload = new Agenda(data);
      const agenda = await this.AgendaRepository.add(payload);

      this.emit(SUCCESS, {
        results: agenda,
        meta: {},
      });
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

CreateAgenda.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateAgenda;
