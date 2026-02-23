
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios' 
axios.defaults.withCredentials = true


export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async ({ search = "", page = 1, limit = 9 }, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/post/posts`, {
        params: { search, page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default postsSlice.reducer;
