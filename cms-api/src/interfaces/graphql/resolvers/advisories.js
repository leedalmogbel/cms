module.exports = {
  Query: {
    getAdvisories: async (_, args, { container, res }) => {
      const operation = container.resolve('ListAdvisories');
      const advisories = await operation.execute(args);

      return advisories;
    },
    getAdvisory: async (_, args, { container, res }) => {
        const operation = container.resolve('ShowAdvisory');
        const advisory = await operation.execute(args);

        return advisory;
    },
  },  
  Mutation: {
    createAdvisory: async (_, args, { container, res, next }) => {
      const operation = container.resolve('CreateAdvisory');
      const advisory = await operation.execute(args);

      // if tags exists
      if ('tags' in args.data) {
        const tagOperation = container.resolve('CreateTag');
        const tags = args.data.tags;

        // process advisory tags function
        processTags = async (tags) => {
          for (let tag of tags) {
            const newTag = await tagOperation.execute({ data: tag });
            await advisory.addAdvisoryTag(newTag);
          }
        }

        // process and associate tags
        await processTags(tags);

        // fetch associated advisory tags
        advisory.tags = advisory.getAdvisoryTags();
      }

      return advisory;
    },

    updateAdvisory: async (_, args, { container, res, next }) => {
      const operation = container.resolve('UpdateAdvisory');
      await operation.execute(args);

      // if tags exists
      if ('tags' in args.data) {
        const fetchOperation = container.resolve('ShowAdvisory');
        const advisory = await fetchOperation.execute({ where: { id: args.where.id } });

        // tag operation
        const tagOperation = container.resolve('CreateTag');
        const tags = args.data.tags;

        // process advisory tags function
        processTags = async (tags) => {
          for (let tag of tags) {
            const newTag = await tagOperation.execute({ data: tag });
            await advisory.addAdvisoryTag(newTag);
          }
        }

        // first remove tags
        await advisory.setAdvisoryTags([]);

        // process and associate tags
        await processTags(tags);
      }

      return true;
    },

    deleteAdvisory: async (_, args, { container, res, next }) => {
      const operation = container.resolve('DeleteAdvisory');
      const advisory = await operation.execute(args);

      return advisory;
    }

  },
};