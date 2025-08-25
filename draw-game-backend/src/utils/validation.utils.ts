import { UserInputError } from 'apollo-server-express';

export const validateUsername = (username: string): void => {
  if (username.length < 3 || username.length > 20) {
    throw new UserInputError('Username must be between 3 and 20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new UserInputError('Username can only contain letters, numbers, and underscores');
  }
};

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new UserInputError('Invalid email format');
  }
};

export const validatePassword = (password: string): void => {
  if (password.length < 6) {
    throw new UserInputError('Password must be at least 6 characters long');
  }

  if (!/\d/.test(password)) {
    throw new UserInputError('Password must contain at least one number');
  }

  if (!/[A-Z]/.test(password)) {
    throw new UserInputError('Password must contain at least one uppercase letter');
  }
};

export const validateGameInput = {
  drawing: (data: string): void => {
    if (!data) {
      throw new UserInputError('Drawing data is required');
    }

    if (data.length > 1000000) { // 1MB limit
      throw new UserInputError('Drawing data too large');
    }
  },

  story: (content: string): void => {
    if (!content) {
      throw new UserInputError('Story content is required');
    }

    if (content.length < 10 || content.length > 500) {
      throw new UserInputError('Story must be between 10 and 500 characters');
    }
  },

  roomSettings: (settings: {
    maxPlayers: number;
    rounds: number;
    timePerRound: number;
  }): void => {
    if (settings.maxPlayers < 2 || settings.maxPlayers > 10) {
      throw new UserInputError('Number of players must be between 2 and 10');
    }

    if (settings.rounds < 1 || settings.rounds > 10) {
      throw new UserInputError('Number of rounds must be between 1 and 10');
    }

    if (settings.timePerRound < 30 || settings.timePerRound > 300) {
      throw new UserInputError('Time per round must be between 30 and 300 seconds');
    }
  }
};

export const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};