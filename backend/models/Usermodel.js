import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    /** required **/
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact_no: {
        type: String,
        required: true,
    },
    /** required **/

    /* optional */
    verified_reset_password: {
        type: Boolean,
        default: false
    },
    cloudinary_id: {
        type: String,
        default: "cld_url"
    },
    bio: {
        type: String,
        default: "Hello there!"
    },
    location: {
        type: String,
    },
    otp: {
        value: { type: String },
        expiresAt: { type: Date, index: { expires: 300 } },
    },
    avatar: {
        type: String,
        default: "my avatar"
    },

    posts: [{ type: mongoose.Schema.ObjectId, ref: "posts" }],

    saved_posts: [{ type: mongoose.Schema.ObjectId, ref: "posts" }],

    following: [{ type: mongoose.Schema.ObjectId, ref: "users" }],

    followers: [{ type: mongoose.Schema.ObjectId, ref: "users" }]

},
    {
        timestamps: true
    })

const userModel = mongoose.model("users", userSchema)

export default userModel