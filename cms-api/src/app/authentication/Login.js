const { Operation } = require('@brewery/core');
const Post = require('src/domain/Post');

class Login extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(data) {

    const isKappUser = async () =>{
      const users = await this.UserRepository.getAll({});
      console.log({users});
      if(users.length > 0){
        return true;
      }
      throw new Error('user not found.');
    }; 
      
      //Call LDAP
      //Call Cognito
      //Return Access tolen

    if(await isKappUser()){
      return {
        accessToken:'ACCESS_TOKEN',
      };
    }
    

  }
}

module.exports = Login;
