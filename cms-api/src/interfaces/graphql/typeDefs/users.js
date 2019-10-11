
module.exports = `

type User {
  id: String
  content : ContentType
}

type ContentType {
  firstName: String
  lastName: String
}

type Query {
  users: [User]
  user(where: UserPrimary!): User
}

type Mutation {
  createUser(data: CreateUserInput!): User!
}

input CreateUserInput {
  input: ContentTypeInput!
}

input UserPrimary {
  id: String!
}
`;
