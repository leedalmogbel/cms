const { Operation } = require('@brewery/core');


class PublishAdvisory extends Operation {
  constructor({ SaveAdvisory }) {
    super();
    this.SaveAdvisory = SaveAdvisory;
  }

  async execute({ where: { id }, data }) {
    // process with save advisory
    const advisory = await this.SaveAdvisory.execute({
      where: { id },
      data: {
        ...data,
        publishedAt: new Date().toISOString(),
        draft: false,
      },
    });

    return advisory;
  }
}

module.exports = PublishAdvisory;
