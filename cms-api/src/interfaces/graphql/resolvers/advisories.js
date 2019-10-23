module.exports = {
  Query: {
    getAdvisories: (_, args, { container, res }) => {
      const operation = container.resolve('ListAdvisories');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getAdvisory: (_, args, { container, res }) => {
      const operation = container.resolve('ShowAdvisory');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
  },  
  Mutation: {
    createDraftAdvisory: (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateDraftAdvisory');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    saveDraftAdvisory: (_, args, { container, res, next }) => {
      const operation = container.resolve('SaveDraftAdvisory');

      try {
        return operation.save(args);
      } catch (err) {
        throw err;
      }
    },
    publishAdvisory: (_, args, { container, res, next }) => {
      const operation = container.resolve('PublishAdvisory');

      try {
        return operation.publish(args);
      } catch (err) {
        throw err;
      }
    },
    deleteAdvisory: (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteAdvisory');
      // const advisory = operation.execute(args);

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    attachmentUrlAdvisory: (_, args, { container, res }) => {
      const operation = container.resolve('AttachmentUrlAdvisory');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    }
  }
};