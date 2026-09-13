import userModel from "../models/Usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import axios from "axios";
axios.defaults.withCredentials = true;
import dotenv from "dotenv";
dotenv.config();
import redisClient from "../utils/redis.js";

const publicUser = (user) => {
  const value = user?.toObject ? user.toObject() : { ...user };
  delete value.password;
  delete value.otp;
  delete value.cloudinary_id;
  return value;
};

const invalidateUserCache = async (user) => {
  try {
    await redisClient.del(`user:${user._id}`);
    await redisClient.del(`login:${user.email}`);
  } catch (error) {
    console.error("Redis cache invalidation failed:", error.message);
  }
};
/**** Auth *****/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "every field must be provided.." });
    }

    // Password verification must use the database record, never a cached
    // serialised user object.
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user with such email is registered!" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({ message: "Invalid Credentials.." });
    }

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

    // Cache user data in Redis (TTL: 1 day = 86400 seconds)
    try {
      const userData = JSON.stringify(publicUser(user));
      await redisClient.set(`user:${user._id}`, userData, { EX: 86400 });
      await redisClient.set(`login:${email}`, userData, { EX: 86400 });
      console.log(`✅ Cached user:${user._id} in Redis (by id + email)`);
    } catch (cacheErr) {
      console.error("Redis cache write failed:", cacheErr.message);
    }

    const lifetimeDays = Number.parseInt(process.env.JWT_EXPIRES, 10) || 1;
    const options = {
      expires: new Date(Date.now() + lifetimeDays * 24 * 3600 * 1000),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    };
    res
      .cookie("token", token, options)
      .status(200)
      .json({ user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: `Error occurred: ${error.message}` });
  }
};
export const register = async (req, res) => {
  try {
    const { email, username, password, contact_no } = req.body;
    if (
      ![email, username, password, contact_no].every(
        (value) => typeof value === "string" && value.trim(),
      )
    ) {
      return res.status(400).json({ message: "Every field must be provided" });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({ message: "User with this email already exists" });
    }

    const isUsernameExists = await userModel.findOne({ username });
    if (isUsernameExists) {
      return res.json({
        message: `This username: ${username} has already been used`,
      });
    }

    /* checking password length and if it has space */

    const passwordLength = password.length;
    if (passwordLength < 8) {
      return res.json({ message: "password must have 8 characters" });
    }
    if (!/^\d{9,}$/.test(contact_no)) {
      return res.json({ message: "contact no must have 9 numbers" });
    }

    if (password.includes(" ")) {
      return res.json({ message: "password can not have spaces in it" });
    }

    /** **/

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      contact_no,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "Registered new user", user: publicUser(newUser) });
  } catch (error) {
    return res.status(404).json({ message: "error while registering", error });
  }
};
export const logout = async (req, res) => {
  try {
    // Invalidate user cache in Redis on logout
    await invalidateUserCache(req.user);

    return res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error : ${error}` });
  }
};
/** reset password **/
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await userModel.findById(req.user._id);
    const otpFromDB = user?.otp;
    //console.log(otpFromDB);

    if (!otpFromDB) {
      return res.status(400).json({ message: "Otp is not in db" });
    }

    if (Date.now() > new Date(otpFromDB.expiresAt).getTime()) {
      return res.status(400).json({ message: "OTP is expired" });
    }

    const isMatched = await bcrypt.compare(otp.toString(), otpFromDB.value);
    if (!isMatched) {
      return res.status(400).json({ message: "OTP does not match!" });
    }
    const email = req.user.email;
    await userModel.findOneAndUpdate(
      { email },
      {
        verified_reset_password: true,
        $unset: { otp: "" }, // Removes OTP after verification
      },
      { new: true },
    );
    await invalidateUserCache(user);
    return res.status(200).json({ message: "OTP verified!" });
  } catch (error) {
    return res.status(500).json({ message: "error varifying otp", error });
  }
};
export const sendOTP = async (req, res) => {
  try {
    const email = req.user.email;

    const random4Digit = Math.floor(1000 + Math.random() * 9000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP code is: ${random4Digit}. This code expires in 5 minute.`,
    };
    await transporter.sendMail(mailOptions);

    let hashedOTP = await bcrypt.hash(random4Digit.toString(), 10);

    await userModel.findOneAndUpdate(
      { email },
      {
        otp: {
          value: hashedOTP,
          expiresAt: new Date(Date.now() + 60 * 5 * 1000),
        },
      },
      { new: true },
    );

    return res.status(200).json({ message: "OTP sent!" });
  } catch (error) {
    return res.status(500).json({ message: "error sending otp", error });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await userModel.findOne({ email: email.trim().toLowerCase() });
    // Do not reveal whether an address is registered.
    if (!user)
      return res
        .status(200)
        .json({ message: "If an account exists, an OTP has been sent." });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.otp = {
      value: await bcrypt.hash(otp, 10),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    user.verified_reset_password = false;
    await user.save();
    await invalidateUserCache(user);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
    });
    return res
      .status(200)
      .json({ message: "If an account exists, an OTP has been sent." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to send reset OTP" });
  }
};

export const verifyPasswordReset = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({
      email: email?.trim().toLowerCase(),
    });
    if (
      !user?.otp?.value ||
      !user.otp.expiresAt ||
      Date.now() > user.otp.expiresAt.getTime()
    ) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }
    if (!(await bcrypt.compare(String(otp || ""), user.otp.value))) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }
    const resetToken = jwt.sign(
      { id: user._id, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    return res.status(200).json({ resetToken });
  } catch (error) {
    return res.status(400).json({ message: "OTP is invalid or expired" });
  }
};

export const confirmPasswordReset = async (req, res) => {
  try {
    const { resetToken, newpassword } = req.body;
    if (
      typeof newpassword !== "string" ||
      newpassword.length < 8 ||
      /\s/.test(newpassword)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters and contain no spaces",
        });
    }
    const payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (payload.purpose !== "password-reset") throw new Error("Invalid token");
    const user = await userModel.findById(payload.id);
    if (!user) throw new Error("Invalid token");
    user.password = await bcrypt.hash(newpassword, 10);
    user.otp = undefined;
    user.verified_reset_password = false;
    await user.save();
    await invalidateUserCache(user);
    return res
      .status(200)
      .json({ message: "Password updated. Please sign in." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Reset link is invalid or expired" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newpassword } = req.body;
    const email = req.user.email;
    const currentUser = await userModel.findById(req.user._id);
    const vrp = currentUser?.verified_reset_password;

    if (!vrp) {
      return res
        .status(400)
        .json({
          message:
            "Does not have access to change password , authenticate via OTP first!",
        });
    }
    if (!newpassword) {
      return res.status(400).json({ message: "Should enter new password" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        verified_reset_password: false,
      },
      { new: true },
    );
    await invalidateUserCache(updatedUser);
    return res.status(201).json({ message: "Password updated!" });
  } catch (error) {
    return res.status(400).json(error);
  }
};
/** reset password **/

/**** Auth *****/

/********/
export const updateProfile = async (req, res) => {
  try {
    const { bio, location } = req.body;
    const user = await userModel.findById(req.user._id);
    if (req.file) {
      const { path } = req.file;
      let cloudFiles;
      if (path) {
        cloudFiles = await cloudinary.uploader.upload(path);
        user.avatar = cloudFiles?.secure_url;
        user.cloudinary_id = cloudFiles?.public_id;
        fs.unlinkSync(req.file.path);
      }
    }
    user.bio = bio;
    user.location = location;

    await user.save();

    // Invalidate cached user data after profile update
    try {
      await redisClient.del(`user:${req.user._id}`);
      await redisClient.del(`login:${req.user.email}`);
      console.log(
        `🗑️ Invalidated cache for user:${req.user._id} after profile update`,
      );
    } catch (cacheErr) {
      console.error("Redis cache invalidation failed:", cacheErr.message);
    }

    return res.status(201).json({ message: "updated", user: publicUser(user) });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const showmyprofile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(publicUser(user));
  } catch (error) {
    return res.status(500).json({ message: "Errro showing my profile", error });
  }
};
export const visitprofile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId.toString() == req.user._id.toString()) {
      const user = await userModel.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(publicUser(user));
    }
    const user = await userModel
      .findById(userId)
      .select("-password -cloudinary_id")
      .populate("posts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Errro showing my profile", error });
  }
};
export const follow = async (req, res) => {
  try {
    const myId = req.user._id;
    const me = await userModel.findById(myId);
    const { userId } = req.params;
    if (myId.toString() === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const target = await userModel.findById(userId);
    if (!me || !target)
      return res.status(404).json({ message: "User not found" });

    if (me.following.includes(userId)) {
      await userModel.findByIdAndUpdate(
        myId,
        {
          $pull: { following: userId },
        },
        { new: true },
      );

      await userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { followers: myId },
        },
        { new: true },
      );
      await invalidateUserCache(me);
      await invalidateUserCache(target);

      return res
        .status(200)
        .json({ message: `I've unfollowed userId : ${userId}` });
    } else {
      await userModel.findByIdAndUpdate(
        myId,
        {
          $addToSet: { following: userId },
        },
        { new: true },
      );

      await userModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { followers: myId },
        },
        { new: true },
      );
      await invalidateUserCache(me);
      await invalidateUserCache(target);

      return res
        .status(200)
        .json({ message: `I've started following userId : ${userId}` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error following", error: `${error}` });
  }
};
export const searchUser = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { contact_no: { $regex: search, $options: "i" } },
      ];
    }
    const users = await userModel
      .find(query)
      .select("_id username email avatar contact_no location");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error while searching user." });
  }
};
/********/
export default login;
