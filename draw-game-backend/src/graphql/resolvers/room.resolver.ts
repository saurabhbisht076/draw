import { RoomService } from '../../services/room.service';
import { Context } from '../../types/context';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const roomResolvers = {
  Query: {
    room: async (_: any, { id }: { id: string }) => {
      return RoomService.getRoomById(id);
    },
    activeRooms: async () => {
      return RoomService.getActiveRooms();
    }
  },

  Mutation: {
    createRoom: async (_: any, { input }: { input: any }, { user }: Context) => {
      return RoomService.createRoom(user.id, input);
    },
    joinRoom: async (_: any, { code }: { code: string }, { user }: Context) => {
      return RoomService.joinRoom(code, user.id);
    },
    leaveRoom: async (_: any, { roomId }: { roomId: string }, { user }: Context) => {
      return RoomService.leaveRoom(roomId, user.id);
    }
  },

  Subscription: {
    roomUpdated: {
      subscribe: (_: any, { roomId }: { roomId: string }) => 
        pubsub.asyncIterator(`ROOM_UPDATED_${roomId}`)
    },
    playerJoined: {
      subscribe: (_: any, { roomId }: { roomId: string }) => 
        pubsub.asyncIterator(`PLAYER_JOINED_${roomId}`)
    },
    playerLeft: {
      subscribe: (_: any, { roomId }: { roomId: string }) => 
        pubsub.asyncIterator(`PLAYER_LEFT_${roomId}`)
    }
  }
};