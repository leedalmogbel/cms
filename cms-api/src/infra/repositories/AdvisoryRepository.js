
const { BaseRepository } = require('@brewery/core');

class AdvisoryRepository extends BaseRepository {
  constructor({ AdvisoryModel }) {
    super(AdvisoryModel);
  }
}

module.exports = AdvisoryRepository;

