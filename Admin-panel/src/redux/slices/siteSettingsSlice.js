import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSiteSettings = createAsyncThunk('siteSettings/fetch', async () => {
  const res = await api.get('/admin/site-settings');
  return res.data;
});

export const updateSiteSettings = createAsyncThunk('siteSettings/update', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/admin/site-settings', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState: { data: null, isLoading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSiteSettings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchSiteSettings.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      .addCase(updateSiteSettings.fulfilled, (state, action) => { state.data = action.payload; })
      .addCase(updateSiteSettings.rejected, (state, action) => { state.error = action.payload; });
  }
});

export default siteSettingsSlice.reducer;