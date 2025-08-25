import { userResolvers } from './user.resolver';
import { roomResolvers } from './room.resolver';
import { gameResolvers } from './game.resolver';
import { mergeResolvers } from '@graphql-tools/merge';

const resolvers = mergeResolvers([
  userResolvers,
  roomResolvers,
  gameResolvers
]);

export default resolvers;