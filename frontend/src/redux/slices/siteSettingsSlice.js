import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSiteSettings = createAsyncThunk('siteSettings/fetch', async () => {
  const res = await api.get('/site-settings');
  return res.data;
});

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteSettings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchSiteSettings.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; });
  },
});

export const selectSiteSettings = (state) => state.siteSettings.data;
export const selectSiteSettingsLoading = (state) => state.siteSettings.isLoading;
export const selectSiteSettingsError = (state) => state.siteSettings.error;

export default siteSettingsSlice.reducer;