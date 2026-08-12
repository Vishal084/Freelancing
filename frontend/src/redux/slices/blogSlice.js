// frontend/src/redux/slices/blogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/blogs');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { items: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBlogs.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchBlogs.rejected, (state, action) => { state.isLoading = false; state.error = action.payload || 'Failed to load blogs'; });
  },
});
export const selectBlogs = (state) => state.blogs.items;
export const selectBlogsLoading = (state) => state.blogs.isLoading;
export const selectBlogsError = (state) => state.blogs.error;
export default blogSlice.reducer;