const Status = require('http-status');

module.exports = {
  Query: {
    advisories: async (_, args, { container, res }) => {
      const operation = container.resolve('ListAdvisories');
      const advisories = await operation.execute(args);

      return advisories;
    },
    advisory: async (_, args, { container, res }) => {
        const operation = container.resolve('ShowAdvisory');
        const advisory = await operation.execute(args);

        return advisory;
    },
  },  
  Mutation: {
    createAdvisory: async (_, args, { container, res, next },
    ) => {

      const operation = container.resolve('CreateAdvisory');
      const advisory = await operation.execute(args);

      return advisory;
    },

    updateAdvisory: async (_, args, { container, res, next },
      ) => {
  
        const operation = container.resolve('UpdateAdvisory');
        const advisory = await operation.execute(args);

        return advisory;
      },

      deleteAdvisory: async (_, args, { container, res, next },
        ) => {
    
          const operation = container.resolve('DeleteAdvisory');
          const advisory = await operation.execute(args);
  
          return advisory;
        },

  },
};