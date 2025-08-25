import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  stats: {
    gamesPlayed: number;
    totalScore: number;
    wins: number;
    averageScore: number;
  };
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  lastActive: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Update average score when total score or games played changes
userSchema.pre('save', function(next) {
  const user = this;
  if (user.stats.gamesPlayed > 0) {
    user.stats.averageScore = Math.round(user.stats.totalScore / user.stats.gamesPlayed);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Static method to find by email
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to update user stats
userSchema.statics.updateStats = async function(userId: string, gameScore: number, isWinner: boolean) {
  const updates = {
    $inc: {
      'stats.gamesPlayed': 1,
      'stats.totalScore': gameScore,
      'stats.wins': isWinner ? 1 : 0
    }
  };
  return this.findByIdAndUpdate(userId, updates, { new: true });
};

// Index creation
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'stats.totalScore': -1 });

export const User = mongoose.model<IUser>('User', userSchema);