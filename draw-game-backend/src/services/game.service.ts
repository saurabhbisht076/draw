import { Game, IGame } from '../models/game.model';
import { Room } from '../models/room.model';
import { redis } from '../config/redis';
import { PubSub } from 'graphql-subscriptions';
import { UserInputError } from 'apollo-server-express';

const pubsub = new PubSub();

export class GameService {
  static async startGame(roomId: string, userId: string): Promise<IGame> {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new UserInputError('Room not found');
    }

    if (room.hostId.toString() !== userId) {
      throw new UserInputError('Only host can start the game');
    }

    const game = await Game.create({
      roomId,
      timeLeft: room.settings.timePerRound
    });

    room.status = 'PLAYING';
    await room.save();

    // Start game timer
    this.startGameTimer(game.id, room.settings.timePerRound);

    pubsub.publish(`GAME_STARTED_${roomId}`, { gameStarted: game });
    return game;
  }

  static async submitDrawing(input: { gameId: string; data: string }, userId: string): Promise<any> {
    const game = await Game.findById(input.gameId);
    if (!game) {
      throw new UserInputError('Game not found');
    }

    if (game.phase !== 'DRAWING') {
      throw new UserInputError('Not in drawing phase');
    }

    const drawing = {
      userId,
      data: input.data,
      createdAt: new Date()
    };

    game.drawings.push(drawing);
    await game.save();

    pubsub.publish(`DRAWING_SUBMITTED_${game.id}`, { drawingSubmitted: drawing });
    return drawing;
  }

  static async submitStory(input: { gameId: string; drawingId: string; content: string }, userId: string): Promise<any> {
    const game = await Game.findById(input.gameId);
    if (!game) {
      throw new UserInputError('Game not found');
    }

    if (game.phase !== 'STORYTELLING') {
      throw new UserInputError('Not in storytelling phase');
    }

    const story = {
      userId,
      drawingId: input.drawingId,
      content: input.content,
      createdAt: new Date()
    };

    game.stories.push(story);
    await game.save();

    pubsub.publish(`STORY_SUBMITTED_${game.id}`, { storySubmitted: story });
    return story;
  }

  private static async startGameTimer(gameId: string, duration: number) {
    const key = `game:timer:${gameId}`;
    await redis.set(key, duration);
    
    const timer = setInterval(async () => {
      const timeLeft = await redis.decr(key);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        await this.progressGamePhase(gameId);
      }

      pubsub.publish(`GAME_TIMER_${gameId}`, { gameTimer: timeLeft });
    }, 1000);
  }

  private static async progressGamePhase(gameId: string) {
    const game = await Game.findById(gameId);
    if (!game) return;

    const phases = ['DRAWING', 'STORYTELLING', 'VOTING', 'RESULTS'];
    const currentPhaseIndex = phases.indexOf(game.phase);
    const nextPhase = phases[currentPhaseIndex + 1];

    if (nextPhase) {
      game.phase = nextPhase;
      await game.save();
      
      const room = await Room.findById(game.roomId);
      if (room) {
        this.startGameTimer(gameId, room.settings.timePerRound);
      }
    } else {
      await this.endGame(gameId);
    }

    pubsub.publish(`GAME_PHASE_CHANGED_${gameId}`, { gamePhaseChanged: game });
  }

  private static async endGame(gameId: string) {
    const game = await Game.findById(gameId);
    if (!game) return;

    game.status = 'COMPLETED';
    await game.save();

    const room = await Room.findById(game.roomId);
    if (room) {
      room.status = 'FINISHED';
      await room.save();
    }

    pubsub.publish(`GAME_ENDED_${gameId}`, { gameEnded: game });
  }
}