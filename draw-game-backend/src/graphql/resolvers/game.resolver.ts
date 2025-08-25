import { GameService } from '../../services/game.service';
import { Context } from '../../types/context';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const gameResolvers = {
  Query: {
    game: async (_: any, { id }: { id: string }) => {
      return GameService.getGameById(id);
    },
    gameHistory: async (_: any, { userId }: { userId: string }) => {
      return GameService.getGameHistory(userId);
    }
  },

  Mutation: {
    startGame: async (_: any, { roomId }: { roomId: string }, { user }: Context) => {
      return GameService.startGame(roomId, user.id);
    },
    submitDrawing: async (_: any, { input }: { input: any }, { user }: Context) => {
      return GameService.submitDrawing(input, user.id);
    },
    submitStory: async (_: any, { input }: { input: any }, { user }: Context) => {
      return GameService.submitStory(input, user.id);
    },
    submitVote: async (_: any, { input }: { input: any }, { user }: Context) => {
      return GameService.submitVote(input, user.id);
    }
  },

  Subscription: {
    gameStateUpdated: {
      subscribe: (_: any, { gameId }: { gameId: string }) => 
        pubsub.asyncIterator(`GAME_UPDATED_${gameId}`)
    },
    drawingSubmitted: {
      subscribe: (_: any, { gameId }: { gameId: string }) => 
        pubsub.asyncIterator(`DRAWING_SUBMITTED_${gameId}`)
    }
  }
};