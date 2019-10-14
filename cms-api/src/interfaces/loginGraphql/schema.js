const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const { makeExecutableSchema } = require('graphql-tools');
const path = require('path');

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const Schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


module.exports = Schema;
