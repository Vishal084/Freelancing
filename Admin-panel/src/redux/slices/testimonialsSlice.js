// admin-panel/src/redux/slices/testimonialsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/adminService';

export const fetchTestimonials = createAsyncThunk('testimonials/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getTestimonials();
    return res.testimonials;   // ✅ extract array
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addTestimonial = createAsyncThunk('testimonials/create', async (data, { rejectWithValue }) => {
  try {
    return await createTestimonial(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const editTestimonial = createAsyncThunk('testimonials/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateTestimonial(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const removeTestimonial = createAsyncThunk('testimonials/delete', async (id, { rejectWithValue }) => {
  try {
    return await deleteTestimonial(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addTestimonial.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editTestimonial.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(removeTestimonial.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.meta.arg);
      });
  },
});

export default testimonialsSlice.reducer;