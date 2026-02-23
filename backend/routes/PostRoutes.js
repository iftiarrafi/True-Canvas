import express from 'express'
import getallposts, { createpost, deletepost, followingPosts, getmyposts, likePost, save_post, singlepost, updatepost } from '../controller/PostController.js'
import isAuthenticated from '../auth/Auth.js'
import { upload } from '../utils/multer.js'

const postrouter = express.Router()

/*********** CRUD *******/
postrouter.post("/create-post", isAuthenticated, upload.single('image_url'), createpost)
postrouter.patch("/update-post/:postId", isAuthenticated, updatepost)
postrouter.get("/my-posts", isAuthenticated, getmyposts)
postrouter.delete("/delete-post/:postId", isAuthenticated, deletepost)
/*********** CRUD *******/

postrouter.get("/posts", isAuthenticated, getallposts)
postrouter.get("/posts/following", isAuthenticated, followingPosts)
postrouter.get("/:postId([0-9a-fA-F]{24})", isAuthenticated, singlepost)
postrouter.patch("/like-a-post/:postId", isAuthenticated, likePost)
postrouter.patch("/save-post/:postId", isAuthenticated, save_post)



export default postrouter