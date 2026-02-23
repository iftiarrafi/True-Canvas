import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.ObjectId, ref: "users" , required : true },
    postId: { type: mongoose.Schema.ObjectId, ref: "posts" , required : true },
    likes: [
        {
            type: mongoose.Schema.ObjectId, ref: "users , required : true"
        }
    ]
})

const commentModel = new mongoose.model("comments", commentSchema)

export default commentModel