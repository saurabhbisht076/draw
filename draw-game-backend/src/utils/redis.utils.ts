import { redis } from '../config/redis';

export const cacheManager = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, expireInSeconds?: number): Promise<void> {
    await redis.set(key, JSON.stringify(value));
    if (expireInSeconds) {
      await redis.expire(key, expireInSeconds);
    }
  },

  async delete(key: string): Promise<void> {
    await redis.del(key);
  },

  async increment(key: string): Promise<number> {
    return redis.incr(key);
  },

  async decrement(key: string): Promise<number> {
    return redis.decr(key);
  }
};

export const gameCache = {
  async getGameState(gameId: string) {
    return cacheManager.get(`game:${gameId}`);
  },

  async setGameState(gameId: string, state: any) {
    await cacheManager.set(`game:${gameId}`, state);
  },

  async clearGameState(gameId: string) {
    await cacheManager.delete(`game:${gameId}`);
  }
};