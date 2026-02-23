
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.withCredentials = true

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/post/create-post", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.newPost;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);



export const likePost = createAsyncThunk(
  "post/likePost",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/v1/post/like-a-post/${postId}`);
      return { postId, likes: response.data.likes };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Action failed");
    }
  }
);

export const savePost = createAsyncThunk(
  "post/savePost",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/v1/post/save-post/${postId}`);
      return { postId, status: response.data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Action failed");
    }
  }
);

export const fetchSinglePost = createAsyncThunk(
  "post/fetchSingle",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/post/${postId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, comment }, thunkAPI) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/comment/add-comment/${postId}`, { comment });
      return response.data.comment;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Comment failed");
    }
  }
);

export const fetchComments = createAsyncThunk(
  "post/fetchComments",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/comment/get-comments/${postId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  "post/fetchMyPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/post/my-posts", {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    currentPost: null,
    myPosts: [],
    comments: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearPostMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Post uploaded!";
        state.myPosts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.successMessage = "Post updated!";
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.successMessage = "Post saved!";
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.successMessage = "Comment added!";
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
      });
  },
});

export const { clearPostMessage } = postSlice.actions;
export default postSlice.reducer;
