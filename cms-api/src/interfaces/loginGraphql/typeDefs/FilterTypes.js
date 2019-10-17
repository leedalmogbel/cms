module.exports = `

scalar DateTime

input IDFilterType {
	# Equals
	eq: ID
	# Not Equals
	ne: ID
	# In array
	in: [ID!]
	# Not in array
	not_in: [ID!]
	# Less than
	lt: ID
	# Less than or equal
	lte: ID
	# Greater than
	gt: ID
	# Greater than or equal
	gte: ID
	# Between 2 array values
	between: [ID!]
	# Not Between 2 array values
	notBetween: [ID!]
}

input IntFilterType {
	# Equals
	eq: Int
	# Not Equals
	ne: Int
	# In array
	in: [Int!]
	# Not in array
	not_in: [Int!]
	# Less than
	lt: Int
	# Less than or equal
	lte: Int
	# Greater than
	gt: Int
	# Greater than or equal
	gte: Int
	# Between 2 array values
	between: [Int!]
	# Not Between 2 array values
	notBetween: [Int!]
}

input FloatFilterType {
	# Equals
	eq: Float
	# Not Equals
	ne: Float
	# In array
	in: [Float!]
	# Not in array
	not_in: [Float!]
	# Less than
	lt: Float
	# Less than or equal
	lte: Float
	# Greater than
	gt: Float
	# Greater than or equal
	gte: Float
	# Between 2 array values
	between: [Float!]
	# Not Between 2 array values
	notBetween: [Float!]
}

input BooleanFilterType {
	# Equals
	eq: Boolean
	# Not Equals
	ne: Boolean
}

input StringFilterType {
	# Equals
	eq: String
	# Not Equals
	ne: String
	# In array
	in: [String!]
	# Not in array
	not_in: [String!]
	# Wildcard operator
	like: String
	# Wildcard operator
	notLike: String
}


input DateFilterType {
	# Equals
	eq: DateTime
	# Not Equals
	ne: DateTime
	# In array
	in: [DateTime!]
	# Not in array
	not_in: [DateTime!]
	# Less than
	lt: DateTime
	# Less than or equal
	lte: DateTime
	# Greater than
	gt: DateTime
	# Greater than or equal
	gte: DateTime
	# Between 2 array values
	between: [DateTime!]
	# Not Between 2 array values
	notBetween: [DateTime!]
}

enum OrderByEnum {
	ASC
	DESC
}
`;
