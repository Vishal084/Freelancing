import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // central axios instance

// Async thunk to fetch testimonials from the backend
export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to load testimonials'
      );
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTestimonials = (state) => state.testimonials.items;
export const selectTestimonialsLoading = (state) => state.testimonials.isLoading;
export const selectTestimonialsError = (state) => state.testimonials.error;

export default testimonialSlice.reducer;