import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Context } from '../../types/context';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }: Context) => {
      return UserService.getUserById(user.id);
    },
    user: async (_: any, { id }: { id: string }) => {
      return UserService.getUserById(id);
    },
    users: async () => {
      return UserService.getAllUsers();
    }
  },

  Mutation: {
    register: async (_: any, { input }: { input: any }) => {
      return AuthService.register(input);
    },
    login: async (_: any, { input }: { input: any }) => {
      return AuthService.login(input);
    },
    updateProfile: async (_: any, { username }: { username: string }, { user }: Context) => {
      return UserService.updateUser(user.id, { username });
    }
  }
};