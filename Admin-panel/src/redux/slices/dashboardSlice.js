import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboard } from '../../Services/adminService';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  return await getDashboard();
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;