import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../Services/adminService';

export const fetchTestimonials = createAsyncThunk('testimonials/fetch', getTestimonials);
export const addTestimonial = createAsyncThunk('testimonials/create', (data) => createTestimonial(data));
export const editTestimonial = createAsyncThunk('testimonials/update', ({ id, data }) => updateTestimonial(id, data));
export const removeTestimonial = createAsyncThunk('testimonials/delete', (id) => deleteTestimonial(id));

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(addTestimonial.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(editTestimonial.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(removeTestimonial.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t.id !== action.meta.arg);
      });
  },
});

export default testimonialsSlice.reducer;