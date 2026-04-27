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
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "100mb" }))
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

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

const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`)
})