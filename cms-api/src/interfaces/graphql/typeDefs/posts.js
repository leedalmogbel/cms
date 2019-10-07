
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
  createPost(data: CreatePostInput!): Post!
}

input CreatePostInput {
    input: ContentTypeInput!
}

input ContentTypeInput {
  body: String
  createdAt: DateTime
}


input PostPrimary {
  id: String!
}
`;
