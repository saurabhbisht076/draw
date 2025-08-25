import Redis from 'ioredis';
import { config } from './environment';

export const redis = new Redis(config.REDIS_URL);

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
  process.exit(1);
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});