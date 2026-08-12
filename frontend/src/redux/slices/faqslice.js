import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPublicFAQs = createAsyncThunk('faqs/fetchPublic', async () => {
  const res = await api.get('/faqs');
  return res.data;
});

export const submitFAQ = createAsyncThunk('faqs/submit', async (faqData, { rejectWithValue }) => {
  try {
    const res = await api.post('/faqs', faqData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const faqSlice = createSlice({
  name: 'faqs',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearFAQError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicFAQs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPublicFAQs.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchPublicFAQs.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      .addCase(submitFAQ.fulfilled, (state, action) => {
        // Optionally add to list (but it won't appear until approved)
        // state.items.push(action.payload); // Don't push because it's pending
      })
      .addCase(submitFAQ.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearFAQError } = faqSlice.actions;
export const selectFAQs = (state) => state.faqs.items;
export const selectFAQLoading = (state) => state.faqs.isLoading;
export const selectFAQError = (state) => state.faqs.error;
export default faqSlice.reducer;