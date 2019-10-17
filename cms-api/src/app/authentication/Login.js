const { Operation } = require('@brewery/core');

class Login extends Operation {
  constructor({ UserRepository, httpClient}) {
    super();
    this.UserRepository = UserRepository;
    this.httpClient = httpClient;
  }

  async execute(data) {
    const retrieveAccessToken = async () => {
      const response = this.httpClient.get(`${process.env.COGNITO_ENDPOINT}/accesstoken`, {
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
      });
      return response;
    };

    const isKappUser = async () =>{
      const users = await this.UserRepository.getAll({});
      if(users.length > 0){
        return true;
      }
      throw new Error('user not found.');
    }; 
      
    if(await isKappUser()){
      const { results } = await retrieveAccessToken();
      return results;
    }

  }
}

module.exports = Login;
