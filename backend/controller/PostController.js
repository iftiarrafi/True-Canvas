import postModel from "../models/Postmodel.js"
import userModel from "../models/Usermodel.js"
import cloudinary from "../utils/cloudinary.js"
import fs, { rmSync } from 'fs'
import FormData from 'form-data'
import axios from "axios"
axios.defaults.withCredentials = true

/**** CRUD ******/
const getallposts = async (req, res) => {
    try {
        const { search, page = 1, limit = 9 } = req.query;
        const query = {};


        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } }
            ];
        }
        const posts = await postModel
            .find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit || 4))
            .sort({ createdAt: -1 })



        return res.status(200).json(posts)


    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}

export const followingPosts = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followingUsers = user.following;

        const posts = await postModel.find({ author_id: { $in: followingUsers } })
            .sort({ createdAt: -1 })
            .skip((parseInt(page || 1) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('author_id', '_id username')
        return res.status(200).json(posts);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching posts" });
    }
};
export const singlepost = async (req, res) => {
    try {

        const { postId } = req.params
        const post = await postModel.findById(postId)
        return res.status(200).json(post)

    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}
export const getmyposts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await postModel.find({ author_id: userId })
            .sort({ createdAt: -1 })
            .populate('author_id', '_id username')
        return res.status(200).json(posts);

    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}
export const createpost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "You are not authenticated" });
        }

        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Must provide a title" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Must provide an image" });
        }


        const form = new FormData();


        const fileBuffer = fs.readFileSync(req.file.path);
        form.append('file', fileBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });


        const headers = {
            ...form.getHeaders(),
            'Content-Length': form.getLengthSync()
        };


        const aiCheckResponse = await axios.post('http://localhost:5000/check_image', form, {
            headers,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 10000
        });

        // **5. Check if AI-generated**
        if (!aiCheckResponse.data.is_real) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `AI-generated images are not allowed.)`
            });
        }


        const uploadedFile = await cloudinary.uploader.upload(req.file.path);
        if (!uploadedFile) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Cannot get file from Cloudinary." });
        }
        fs.unlinkSync(req.file.path);


        const newPost = await postModel.create({
            title,
            image_url: uploadedFile.secure_url,
            cloudinary_id: uploadedFile.public_id,
            author: user.username,
            author_id: user._id
        });

        user.posts.push(newPost);
        await user.save();

        return res.status(201).json({ message: "Post created successfully!", newPost });

    } catch (error) {

        if (req.file?.path) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        return res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
export const updatepost = async (req, res) => {
    try {
        const { postId } = req.params
        const { title } = req.body
        const userId = req.user._id

        const post = await postModel.findById(postId)

        if (post.author_id.toString() === userId.toString()) {
            if (title) {
                await postModel.findByIdAndUpdate(postId, { title: title }, { new: true })
                return res.status(200).json({ message: "Post updated!" })
            }
            return res.status(400).json({ message: "No changes were made!" });
        }

        return res.status(403).json({ message: "Unauthorized access!" })


    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}
export const deletepost = async (req, res) => {
    try {

        const { postId } = req.params
        const userId = req.user._id

        await userModel.findByIdAndUpdate(userId, {
            $pull: { posts: postId }
        }, {
            new: true
        })

        await postModel.findByIdAndDelete(postId)

        return res.status(200).json({ message: "Post has been deleted!" })



    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}
/**** CRUD ******/
export const save_post = async (req, res) => {
    try {

        const { postId } = req.params
        const userId = req.user._id
        const user = await userModel.findById(userId)

        if (user.saved_posts.includes(postId)) {
            await userModel.findByIdAndUpdate(userId, {
                $pull: { saved_posts: postId }
            }, { new: true })

            return res.status(200).json({ message: "post removed from saved" })
        } else {
            await userModel.findByIdAndUpdate(userId, {
                $addToSet: { saved_posts: postId }
            }, { new: true })

            return res.status(200).json({ message: "post saved!" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Error saving post", error: `${error}` })
    }
}

export const likePost = async (req, res) => {
    try {

        const { postId } = req.params
        const post = await postModel.findById(postId)

        const userId = req.user._id

        if (post.likes.includes(userId)) {
            const updatedPost = await postModel.findByIdAndUpdate(postId,
                {
                    $pull: { likes: userId }
                }, { new: true })

            return res.status(200).json({ message: "like removed", total_like: updatedPost.likes.length })
        } else {
            const updatedPost = await postModel.findByIdAndUpdate(postId,
                {
                    $addToSet: { likes: userId }
                }, { new: true })

            return res.status(200).json({ message: "liked!", total_like: updatedPost.likes.length })
        }


    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}


export default getallposts