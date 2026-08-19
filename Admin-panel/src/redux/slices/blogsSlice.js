// admin-panel/src/redux/slices/blogsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../services/adminService';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBlogs();
      return res.blogs; // extract array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addBlog = createAsyncThunk(
  'blogs/create',
  async (data, { rejectWithValue }) => {
    try {
      return await createBlog(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateBlog(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeBlog = createAsyncThunk(
  'blogs/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteBlog(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(addBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(editBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.list.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(editBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(removeBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((b) => b._id !== action.meta.arg);
      })
      .addCase(removeBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blogsSlice.reducer;