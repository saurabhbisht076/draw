import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  roomId: Schema.Types.ObjectId;
  round: number;
  phase: 'DRAWING' | 'STORYTELLING' | 'VOTING' | 'RESULTS';
  timeLeft: number;
  drawings: Array<{
    userId: Schema.Types.ObjectId;
    data: string;
    createdAt: Date;
  }>;
  stories: Array<{
    userId: Schema.Types.ObjectId;
    drawingId: Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  votes: Array<{
    userId: Schema.Types.ObjectId;
    storyId: Schema.Types.ObjectId;
    createdAt: Date;
  }>;
  scores: Array<{
    userId: Schema.Types.ObjectId;
    score: number;
    drawingPoints: number;
    storyPoints: number;
    votePoints: number;
  }>;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

const gameSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  round: {
    type: Number,
    default: 1
  },
  phase: {
    type: String,
    enum: ['DRAWING', 'STORYTELLING', 'VOTING', 'RESULTS'],
    default: 'DRAWING'
  },
  timeLeft: {
    type: Number,
    default: 60
  },
  drawings: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    data: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  stories: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    drawingId: {
      type: Schema.Types.ObjectId
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  votes: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    storyId: {
      type: Schema.Types.ObjectId
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  scores: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    drawingPoints: {
      type: Number,
      default: 0
    },
    storyPoints: {
      type: Number,
      default: 0
    },
    votePoints: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS'
  }
}, { timestamps: true });

export const Game = mongoose.model<IGame>('Game', gameSchema);