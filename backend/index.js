import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import userRouter from "./routes/UserRoutes.js";
import postrouter from "./routes/PostRoutes.js";
import commentRouter from "./routes/CommentRoutes.js";
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "100mb" }))
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

// app.use("/", (req, res) => {
//     res.send("Welcome to the AI world")
// })

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

app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postrouter)
app.use("/api/v1/comment", commentRouter)


const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`)
})