import jwt from 'jsonwebtoken'
import userModel from '../models/Usermodel.js'
import redisClient from '../utils/redis.js'

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({ message: "unauthorized to access!" })
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET)

        // Try Redis cache first
        try {
            const cachedUser = await redisClient.get(`user:${decodedUser.id}`);
            if (cachedUser) {
                req.user = JSON.parse(cachedUser);
                console.log(`⚡ Auth: served user:${decodedUser.id} from Redis cache`);
                return next();
            }
        } catch (cacheErr) {
            console.error('Redis cache read failed, falling back to MongoDB:', cacheErr.message);
        }

        // Cache miss — query MongoDB and populate cache
        const user = await userModel.findById(decodedUser.id);
        req.user = user;

        try {
            await redisClient.set(`user:${decodedUser.id}`, JSON.stringify(user), { EX: 86400 });
            console.log(`📦 Auth: cached user:${decodedUser.id} in Redis (cache miss)`);
        } catch (cacheErr) {
            console.error('Redis cache write failed:', cacheErr.message);
        }

        next()
    } catch (error) {
        return res.status(500).json({ message: `Error : ${error}` })
    }
}
export default isAuthenticated