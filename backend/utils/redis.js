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

// Redis is an optional cache. Do not prevent the API from starting when it is
// unavailable; callers already fall back to MongoDB.
redisClient.connect().catch((err) => {
    console.error('❌ Redis unavailable; continuing without cache:', err.message);
});

export default redisClient;
