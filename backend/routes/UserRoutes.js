import express from "express"
import login, { follow, logout, register, resetPassword, searchUser, sendOTP, showmyprofile, updateProfile, verifyOTP, visitprofile } from "../controller/UserController.js"
import isAuthenticated from "../auth/Auth.js"
import { upload } from "../utils/multer.js"


const userRouter = express.Router()
/**Auth**/
userRouter.post("/login", login)
userRouter.post("/register", register)
userRouter.post("/logout", isAuthenticated, logout)

/***reset password***/
userRouter.patch('/send-otp', isAuthenticated, sendOTP)
userRouter.patch('/verify-otp', isAuthenticated, verifyOTP)
userRouter.patch('/reset-password', isAuthenticated, resetPassword)
/***reset password***/

/**Auth**/

/***Others***/
userRouter.patch('/update-profile', isAuthenticated, upload.single('avatar'), updateProfile)
userRouter.get('/my-profile', isAuthenticated, showmyprofile)
userRouter.get('/visit-profile/:userId', isAuthenticated, visitprofile)
userRouter.patch('/follow-user/:userId', isAuthenticated, follow)
userRouter.get('/search-user', isAuthenticated, searchUser)

/***Others***/


export default userRouter