import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // centralised Axios (see Fix #5)

export const fetchAboutData = createAsyncThunk(
  'about/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/about');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch about data';
      });
  },
});

export const selectAboutData = (state) => state.about.data;
export const selectAboutLoading = (state) => state.about.isLoading;
export const selectAboutError = (state) => state.about.error;

export default aboutSlice.reducer;