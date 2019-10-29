module.exports = {
  Query: {
    getAdvisories: (_, args, { container }) => {
      const operation = container.resolve('ListAdvisories');
      return operation.execute(args);
    },
    getAdvisory: (_, args, { container }) => {
      const operation = container.resolve('ShowAdvisory');
      return operation.execute(args);
    },
  },
  Mutation: {
    createAdvisoryDraft: (_, args, { container }) => {
      const operation = container.resolve('CreateDraftAdvisory');
      return operation.execute(args);
    },
    saveAdvisory: (_, args, { container }) => {
      const operation = container.resolve('SaveAdvisory');
      return operation.execute(args);
    },
    publishAdvisory: (_, args, { container }) => {
      const operation = container.resolve('PublishAdvisory');
      return operation.execute(args);
    },
    deleteAdvisory: (_, args, { container }) => {
      const operation = container.resolve('DeleteAdvisory');
      return operation.execute(args);
    },
    attachmentUrlAdvisory: (_, args, { container }) => {
      const operation = container.resolve('AttachmentUrlAdvisory');
      return operation.execute(args);
    },
  },
};
