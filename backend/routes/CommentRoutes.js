import express from "express";
import { addComment, getCommentsByPost } from "../controller/CommentController.js";
import isAuthenticated from "../auth/Auth.js";

const commentRouter = express.Router();

commentRouter.post("/add-comment/:postId", isAuthenticated, addComment);
commentRouter.get("/get-comments/:postId", getCommentsByPost);

export default commentRouter;
