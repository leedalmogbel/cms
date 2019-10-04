const { addMiddleware } = require('graphql-add-middleware');

const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const { makeExecutableSchema } = require('graphql-tools');
const path = require('path');

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const authorization = async (root, args, { user, middlewares, handlers }, info, next) => {
  middlewares.authorization.authorize({ action: info.fieldName, user, handlers });

  const result = await next();
  // you can modify result
  return result; // you must return value
};

const Schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
// add middleware to ALL resolvers
// (also to nested resolver if they are defined in schema like Post.author)
addMiddleware(Schema, authorization);


module.exports = Schema;
