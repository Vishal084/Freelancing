import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../Services/adminService';

export const fetchFAQs = createAsyncThunk('faqs/fetch', getFAQs);
export const addFAQ = createAsyncThunk('faqs/create', (data) => createFAQ(data));
export const editFAQ = createAsyncThunk('faqs/update', ({ id, data }) => updateFAQ(id, data));
export const removeFAQ = createAsyncThunk('faqs/delete', (id) => deleteFAQ(id));

const faqsSlice = createSlice({
  name: 'faqs',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFAQs.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(addFAQ.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(editFAQ.fulfilled, (state, action) => {
        const idx = state.list.findIndex(f => f.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(removeFAQ.fulfilled, (state, action) => {
        state.list = state.list.filter(f => f.id !== action.meta.arg);
      });
  },
});

export default faqsSlice.reducer;