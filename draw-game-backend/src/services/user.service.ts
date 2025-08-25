import { User, IUser } from '../models/user.model';
import { UserInputError } from 'apollo-server-express';

export class UserService {
  static async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new UserInputError('User not found');
    }
    return user;
  }

  static async updateUser(id: string, updates: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    if (!user) {
      throw new UserInputError('User not found');
    }
    return user;
  }

  static async updateUserStats(id: string, gameStats: {
    score: number;
    isWinner: boolean;
  }): Promise<void> {
    await User.findByIdAndUpdate(id, {
      $inc: {
        'stats.gamesPlayed': 1,
        'stats.totalScore': gameStats.score,
        'stats.wins': gameStats.isWinner ? 1 : 0
      }
    });
  }

  static async getAllUsers(): Promise<IUser[]> {
    return User.find({});
  }
}