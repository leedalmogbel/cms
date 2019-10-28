const { Operation } = require('@brewery/core');

class DeleteAdvisory extends Operation {
  constructor({ AdvisoryRepository }) {
    super();
    this.AdvisoryRepository = AdvisoryRepository;
  }

  async execute({ where: { id } }) {
    await this.AdvisoryRepository.getById(id);

    try {
      await this.AdvisoryRepository.remove(id);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = DeleteAdvisory;
