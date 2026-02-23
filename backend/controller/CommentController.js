import commentModel from "../models/Commentmodel.js";
import postModel from "../models/Postmodel.js";

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        const userId = req.user._id;

        if (!comment) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await commentModel.create({
            comment,
            author: userId,
            postId
        });

        // Add comment to post's comments array
        await postModel.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id }
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });

    } catch (error) {
        return res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentModel.find({ postId }).populate('author', 'username profile_image');
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};
