
module.exports = `

type AuthCredentials {
  accessToken: String!
  accessTokenExpiresAt: Int! 
}

type Mutation {
  login(credentials: LoginInput!): AuthCredentials!
}

type Query {
  greetings(greet:GreetingsInput): Greetings
}
input GreetingsInput {
  name: String
}

type Greetings {
  greetings: String
}

input LoginInput {
  username: String!
  password: String!
}

`;
