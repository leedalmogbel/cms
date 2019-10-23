const { Operation } = require('@brewery/core');

class PublishPost extends Operation {
  constructor({ SavePost }) {
    super();
    this.SavePost = SavePost;
  }

  async execute({ where: {id}, data }) {
    data = {
      ...data,
      publishedAt: new Date().toISOString(),
      draft: false
    };

    // use save post process
    return await this.SavePost.execute({
      where: { id },
      data
    });
  }
}

module.exports = PublishPost;
