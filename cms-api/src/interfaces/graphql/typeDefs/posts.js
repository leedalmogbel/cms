
module.exports = `

type Post {
  id: String
  content : ContentType
}

type ContentType {
  body: String
  createdAt: DateTime
}

type Query {
  post(where: PostPrimary!): Post
}

type Mutation {
  createPost(data: RegisterInput!): Post!
}

input RegisterInput {
    name: String!
    email: String!
    roleId: String!
    group: String!
    mobileNumber: String!
    channel: String
    department: String!
    division: String!
  }
  input PostPrimary {
    id: String!
  }
`;
