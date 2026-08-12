// admin-panel/src/redux/slices/faqsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../services/adminService';

export const fetchFAQs = createAsyncThunk('faqs/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await getFAQs();
    return res.faqs;   // ✅ extract array
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addFAQ = createAsyncThunk('faqs/create', async (data, { rejectWithValue }) => {
  try {
    return await createFAQ(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const editFAQ = createAsyncThunk('faqs/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateFAQ(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const removeFAQ = createAsyncThunk('faqs/delete', async (id, { rejectWithValue }) => {
  try {
    return await deleteFAQ(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const faqsSlice = createSlice({
  name: 'faqs',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addFAQ.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editFAQ.fulfilled, (state, action) => {
        const idx = state.list.findIndex(f => f._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(removeFAQ.fulfilled, (state, action) => {
        state.list = state.list.filter(f => f._id !== action.meta.arg);
      });
  },
});

export default faqsSlice.reducer;