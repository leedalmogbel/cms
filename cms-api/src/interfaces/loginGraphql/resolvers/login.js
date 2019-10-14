const Status = require('http-status');

module.exports = {
  Query: {
    greetings: async (_, args, { container }) =>{
      return {
        greetings: 'hello world'
      };
    }
  },  
  Mutation: {
    login: async (_, args, { container }) => {
      const operation = container.resolve('Login');
      try {
        return operation.execute(args);
      }catch(err){
        throw err;
      }
    },
  },
};