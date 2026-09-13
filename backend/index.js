import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import userRouter from "./routes/UserRoutes.js";
import postrouter from "./routes/PostRoutes.js";
import commentRouter from "./routes/CommentRoutes.js";
dotenv.config()

// changing dns(recovering mongodb connection issue)
import dns from 'dns'
dns.setServers(["1.1.1.1", "8.8.8.8"])

import { rateLimit } from 'express-rate-limit'

const app = express()
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",");
app.use(cors({ credentials: true, origin: allowedOrigins }))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});

/** -- Database connection -- **/
const DB_URL = process.env.MONGODB_URL
async function connectDB() {
    try {
        await mongoose.connect(DB_URL)
        console.log("Database has been connected..")
    } catch (error) {
        console.log("Database connection failed", error)
    }
}

connectDB()

/**** Routes *****/

app.use(limiter)

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postrouter)
app.use("/api/v1/comment", commentRouter)
app.use("/", (req, res) => {
    res.send("HEllo WORLD")
})

const PORT = Number(process.env.PORT) || 4000
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`)
})

app.use((error, req, res, next) => {
    if (error?.name === "MulterError" || error?.message?.includes("Only JPEG")) {
        return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Unexpected server error" });
});
