import { User } from '../models/user.model';
import { generateToken, verifyToken } from '../utils/auth.utils';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation.utils';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

export class AuthService {
  static async register(input: { username: string; email: string; password: string }) {
    // Validate input
    validateUsername(input.username);
    validateEmail(input.email);
    validatePassword(input.password);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: input.email }, { username: input.username }]
    });

    if (existingUser) {
      throw new UserInputError('User already exists');
    }

    // Create new user
    const user = await User.create({
      ...input,
      stats: {
        gamesPlayed: 0,
        totalScore: 0,
        wins: 0
      }
    });

    // Generate token
    const token = generateToken(user.id);

    return {
      user,
      token
    };
  }

  static async login(input: { email: string; password: string }) {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  }

  static async validateToken(token: string) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      return user;
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new UserInputError('User not found');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid current password');
    }

    validatePassword(newPassword);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    await user.save();

    return true;
  }

  static async resetPasswordRequest(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserInputError('User not found');
    }

    // Implementation for password reset token generation and email sending
    // would go here

    return true;
  }
}