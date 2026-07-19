import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../services/adminService';

export const fetchBlogs = createAsyncThunk('blogs/fetch', getBlogs);
export const addBlog = createAsyncThunk('blogs/create', (data) => createBlog(data));
export const editBlog = createAsyncThunk('blogs/update', ({ id, data }) => updateBlog(id, data));
export const removeBlog = createAsyncThunk('blogs/delete', (id) => deleteBlog(id));

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(addBlog.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(editBlog.fulfilled, (state, action) => {
        const idx = state.list.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(removeBlog.fulfilled, (state, action) => {
        state.list = state.list.filter(b => b.id !== action.meta.arg);
      });
  },
});

export default blogsSlice.reducer;