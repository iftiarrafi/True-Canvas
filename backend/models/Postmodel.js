import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        image_url: { type: String, default: "image_url" },
        author: { type: String, required: true },
        author_id: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
        likes: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
        comments: [{ type: mongoose.Schema.ObjectId, ref: "comments" }],
        cloudinary_id: {
            type: String,
            default: "cld_url"
        },
    },
    { timestamps: true }
);

const postModel = mongoose.model("posts", postSchema);

export default postModel;
