import { Room } from '../models/room.model';
import { User } from '../models/user.model';
import { redis } from '../config/redis';
import { UserInputError } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { generateRoomCode } from '../utils/validation.utils';

const pubsub = new PubSub();

export class RoomService {
  static async createRoom(userId: string, settings: {
    maxPlayers: number;
    rounds: number;
    timePerRound: number;
  }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new UserInputError('User not found');
    }

    const code = await this.generateUniqueCode();
    const room = await Room.create({
      code,
      hostId: userId,
      players: [{ userId, status: 'active', score: 0 }],
      settings,
      status: 'waiting'
    });

    await this.cacheRoomData(room.id, room);
    pubsub.publish('ROOM_CREATED', { roomCreated: room });

    return room;
  }

  static async joinRoom(code: string, userId: string) {
    const room = await Room.findOne({ code });
    if (!room) {
      throw new UserInputError('Room not found');
    }

    if (room.status !== 'waiting') {
      throw new UserInputError('Game already in progress');
    }

    if (room.players.length >= room.settings.maxPlayers) {
      throw new UserInputError('Room is full');
    }

    const existingPlayer = room.players.find(p => p.userId.toString() === userId);
    if (!existingPlayer) {
      room.players.push({
        userId,
        status: 'active',
        score: 0
      });
      await room.save();
    }

    await this.cacheRoomData(room.id, room);
    pubsub.publish(`PLAYER_JOINED_${room.id}`, { 
      playerJoined: { roomId: room.id, userId } 
    });

    return room;
  }

  static async leaveRoom(roomId: string, userId: string) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new UserInputError('Room not found');
    }

    room.players = room.players.filter(p => p.userId.toString() !== userId);

    if (room.players.length === 0) {
      await Room.deleteOne({ _id: roomId });
      await this.clearRoomCache(roomId);
    } else {
      if (room.hostId.toString() === userId) {
        room.hostId = room.players[0].userId;
      }
      await room.save();
      await this.cacheRoomData(roomId, room);
    }

    pubsub.publish(`PLAYER_LEFT_${roomId}`, { 
      playerLeft: { roomId, userId } 
    });

    return true;
  }

  static async updateRoomSettings(roomId: string, userId: string, settings: {
    maxPlayers: number;
    rounds: number;
    timePerRound: number;
  }) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new UserInputError('Room not found');
    }

    if (room.hostId.toString() !== userId) {
      throw new UserInputError('Only host can update settings');
    }

    if (room.status !== 'waiting') {
      throw new UserInputError('Cannot update settings while game is in progress');
    }

    room.settings = settings;
    await room.save();

    await this.cacheRoomData(roomId, room);
    pubsub.publish(`ROOM_UPDATED_${roomId}`, { roomUpdated: room });

    return room;
  }

  static async getActiveRooms() {
    return Room.find({ status: 'waiting' })
      .populate('hostId', 'username')
      .sort({ createdAt: -1 });
  }

  private static async generateUniqueCode(): Promise<string> {
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      code = generateRoomCode();
      const existingRoom = await Room.findOne({ code });
      if (!existingRoom) {
        isUnique = true;
      }
    }

    return code!;
  }

  private static async cacheRoomData(roomId: string, room: any) {
    await redis.set(`room:${roomId}`, JSON.stringify(room), 'EX', 3600); // 1 hour expiry
  }

  private static async clearRoomCache(roomId: string) {
    await redis.del(`room:${roomId}`);
  }
}