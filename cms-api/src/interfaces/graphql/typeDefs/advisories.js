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
  createAdvisory(data: AdvisoryInput!): Advisory!
  updateAdvisory(where: AdvisoryPrimary!, data: AdvisoryInput!): Advisory!
  deleteAdvisory(where: AdvisoryPrimary!): DefaultResponse
}

input AdvisoryInput {
  title: String
  content: String
  attachment: String
  tags: String
}

input AdvisoryPrimary {
  id: String!
}

type DefaultResponse {
  message: String
}
`;