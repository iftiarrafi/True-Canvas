import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('connect', () => {
    console.log('✅ Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

// Connect immediately
await redisClient.connect();

export default redisClient;
