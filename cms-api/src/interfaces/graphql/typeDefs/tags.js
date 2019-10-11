
module.exports = `
  type Tag {
    id: String
    title: String
  }

  type Query {
    tags: [Tag]
    tag(where: TagPrimary!): Tag!
  }

  type Mutation {
    createTag(data: TagInput!): Tag!
    updateTag(where: TagPrimary!, data: TagInput!): Tag!
  }
  
  input TagInput {
    title: String
  }

  input TagPrimary {
    id: String!
  }
`;
