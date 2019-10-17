module.exports = {
  Query: {
    getAdvisories: async (_, args, { container, res }) => {
      const operation = container.resolve('ListAdvisories');

      try {
        return operation.execute(args);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getAdvisory: async (_, args, { container, res }) => {
        const operation = container.resolve('ShowAdvisory');

        try {
          return operation.execute(args);
        } catch (error) {
          throw new Error(error.message);
        }
    },
  },  
  Mutation: {
    createAdvisory: async (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateAdvisory');
      
      try {
        return operation.execute(args);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateAdvisory: async (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdateAdvisory');

      try {
        operation.execute(args);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteAdvisory: async (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteAdvisory');
      const advisory = await operation.execute(args);

      return advisory;
    }

  },
};