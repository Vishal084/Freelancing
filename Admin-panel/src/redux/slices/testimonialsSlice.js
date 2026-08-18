import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../services/adminService';

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTestimonials();
      return res.testimonials; // extract array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addTestimonial = createAsyncThunk(
  'testimonials/create',
  async (data, { rejectWithValue }) => {
    try {
      return await createTestimonial(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editTestimonial = createAsyncThunk(
  'testimonials/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateTestimonial(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeTestimonial = createAsyncThunk(
  'testimonials/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteTestimonial(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTestimonials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(addTestimonial.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(addTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(editTestimonial.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.list.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(editTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(removeTestimonial.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((t) => t._id !== action.meta.arg);
      })
      .addCase(removeTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;