import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import { authDirectiveTransformer } from '../graphql/directives/auth.directive';
import { rateLimitDirectiveTransformer } from '../graphql/directives/rateLimit.directive';
import resolvers from '../graphql/resolvers';

const typesArray = loadFilesSync(path.join(__dirname, './**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Apply directives
schema = authDirectiveTransformer(schema);
schema = rateLimitDirectiveTransformer(schema);

export { schema };