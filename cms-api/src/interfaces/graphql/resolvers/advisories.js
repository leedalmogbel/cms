module.exports = {
  Query: {
    getAdvisories: (_, args, { container }) => {
      const operation = container.resolve('ListAdvisories');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getAdvisory: (_, args, { container }) => {
      const operation = container.resolve('ShowAdvisory');

      try {
        return operation.execute(args);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },  
  Mutation: {
    createAdvisoryDraft: (_, args, { container }) => {
      const operation = container.resolve('CreateAdvisory');

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    saveAdvisory: (_, args, { container }) => {
      const operation = container.resolve('UpdateAdvisory');

      try {
        return operation.save(args);
      } catch (err) {
        throw err;
      }
    },
    publishAdvisory: (_, args, { container }) => {
      const operation = container.resolve('UpdateAdvisory');

      try {
        return operation.publish(args);
      } catch (err) {
        throw err;
      }
    },
    deleteAdvisory: (_, args, { container}) => {
      const operation = container.resolve('DeleteAdvisory');
      const advisory = operation.execute(args);

      try {
        return operation.execute(args);
      } catch (err) {
        throw err;
      }
    },
    getAwsSignedUrl: (_, args, { container }) => {
      const operation = container.resolve('GetAwsSignedUrl');

      try {
        return operation.execute(args);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
};