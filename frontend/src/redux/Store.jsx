import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./FetchAllPosts.jsx";
import authReducer from "./AuthSlice.jsx"
import postSlice from "./PostSlice.jsx"

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth : authReducer,
    uploadPosts : postSlice
  },
});
