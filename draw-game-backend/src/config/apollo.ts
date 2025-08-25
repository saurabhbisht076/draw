import { ApolloServer } from 'apollo-server-express';
import { schema } from '../graphql/schema';
import { redis } from './redis';
import { authMiddleware } from '../utils/auth.utils';

export const createApolloServer = () => {
  return new ApolloServer({
    schema,
    context: ({ req }) => ({
      user: req.user,
      redis
    }),
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await redis.quit();
            },
          };
        },
      },
    ],
  });
};