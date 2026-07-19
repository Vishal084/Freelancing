import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAbout, updateAbout as updateAboutAPI } from '../../services/adminService';

// fetch the single About document
export const fetchAbout = createAsyncThunk('about/fetch', getAbout);

// update the About document (named "updateAbout" to match the import in AboutEdit)
export const updateAbout = createAsyncThunk('about/update', async (data) => {
  return await updateAboutAPI(data);
});

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAbout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // update
      .addCase(updateAbout.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default aboutSlice.reducer;