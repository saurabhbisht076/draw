import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer {
  userId: Schema.Types.ObjectId;
  status: 'active' | 'drawing' | 'guessing' | 'waiting';
  score: number;
  isReady: boolean;
  joinedAt: Date;
}

export interface IRoom extends Document {
  code: string;
  hostId: Schema.Types.ObjectId;
  status: 'waiting' | 'starting' | 'playing' | 'finished';
  players: IPlayer[];
  settings: {
    maxPlayers: number;
    rounds: number;
    timePerRound: number;
    language: string;
    isPrivate: boolean;
    customWords: string[];
  };
  currentRound: number;
  currentPhase: 'waiting' | 'drawing' | 'guessing' | 'results';
  phaseEndTime: Date;
  chat: Array<{
    userId: Schema.Types.ObjectId;
    message: string;
    timestamp: Date;
    type: 'message' | 'system' | 'guess';
  }>;
  wordPool: string[];
  currentWord?: string;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
  password?: string;
}

const roomSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'starting', 'playing', 'finished'],
    default: 'waiting'
  },
  players: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['active', 'drawing', 'guessing', 'waiting'],
      default: 'active'
    },
    score: {
      type: Number,
      default: 0
    },
    isReady: {
      type: Boolean,
      default: false
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    maxPlayers: {
      type: Number,
      default: 8,
      min: 2,
      max: 10
    },
    rounds: {
      type: Number,
      default: 3,
      min: 1,
      max: 10
    },
    timePerRound: {
      type: Number,
      default: 80,
      min: 30,
      max: 300
    },
    language: {
      type: String,
      default: 'en'
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    customWords: [{
      type: String,
      trim: true
    }]
  },
  currentRound: {
    type: Number,
    default: 0
  },
  currentPhase: {
    type: String,
    enum: ['waiting', 'drawing', 'guessing', 'results'],
    default: 'waiting'
  },
  phaseEndTime: {
    type: Date
  },
  chat: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'system', 'guess'],
      default: 'message'
    }
  }],
  wordPool: [{
    type: String,
    trim: true
  }],
  currentWord: {
    type: String,
    select: false // Hide from general queries
  },
  hasPassword: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.wordPool;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
roomSchema.index({ code: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ 'players.userId': 1 });
roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // Auto-delete after 24 hours

// Methods
roomSchema.methods.isPlayerInRoom = function(userId: string): boolean {
  return this.players.some(player => player.userId.toString() === userId);
};

roomSchema.methods.addPlayer = function(userId: string) {
  if (this.players.length >= this.settings.maxPlayers) {
    throw new Error('Room is full');
  }
  
  if (!this.isPlayerInRoom(userId)) {
    this.players.push({
      userId,
      status: 'active',
      score: 0,
      isReady: false,
      joinedAt: new Date()
    });
  }
};

roomSchema.methods.removePlayer = function(userId: string) {
  this.players = this.players.filter(player => player.userId.toString() !== userId);
  
  // If host leaves, assign new host
  if (this.hostId.toString() === userId && this.players.length > 0) {
    this.hostId = this.players[0].userId;
  }
};

// Statics
roomSchema.statics.findByCode = function(code: string) {
  return this.findOne({ code: code.toUpperCase() });
};

roomSchema.statics.getActiveRooms = function() {
  return this.find({
    status: { $in: ['waiting', 'playing'] }
  }).populate('hostId', 'username');
};

export const Room = mongoose.model<IRoom>('Room', roomSchema);