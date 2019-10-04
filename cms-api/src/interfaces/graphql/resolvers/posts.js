
module.exports = {
  Query: {
    user: async (_, args, { handlers }) => handlers.User.show(args),
    users: async (_, args, { handlers }) => handlers.User.search(args),
    usersSummary: async (_, args, { handlers }) => handlers.User.summary(args),
  },
  Mutation: {
    registration: async (_, { data },
      {
        handlers,
        httpInfo,
        user,
      },
    ) => handlers.User.registration(data, httpInfo, user),
    validateToken: async (_, { data },
      {
        handlers,
        httpInfo,
        user,
      }) => handlers.User.validateToken(data, httpInfo, user),
    updateUser: async (_, { data, where },
      {
        handlers,
        httpInfo,
        user,
      }) => handlers.User.updateUser(data, where, httpInfo, user),
    deleteUser: async (_, { data, where },
      {
        handlers,
        httpInfo,
        user,
      }) => handlers.User.deleteUser(data, where, httpInfo, user),
  },
};
  