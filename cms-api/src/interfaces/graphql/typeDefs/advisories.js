module.exports = `

type Advisory {
  id: String
  title: String
  content: String
  attachment: String
  tags: String
}

type Query {
  advisories: [Advisory]
  advisory(where: AdvisoryPrimary!): Advisory!
}

type Mutation {
  createAdvisory(data: CreateAdvisoryInput!): Advisory!
}

input CreateAdvisoryInput {
  title: String
  content: String
  attachment: String
  tags: String
}

input AdvisoryPrimary {
  id: String!
}
`;