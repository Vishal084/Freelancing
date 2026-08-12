import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getServices,
  createService as createServiceAPI,
  updateService as updateServiceAPI,
  deleteService as deleteServiceAPI,
} from '../../services/adminService';

export const fetchServices = createAsyncThunk('services/fetch', async () => await getServices());

export const createService = createAsyncThunk('services/create', async (data, { rejectWithValue }) => {
  try {
    return await createServiceAPI(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateService = createAsyncThunk('services/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateServiceAPI(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteService = createAsyncThunk('services/delete', async (id, { rejectWithValue }) => {
  try {
    return await deleteServiceAPI(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const servicesSlice = createSlice({
  name: 'services',
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchServices.fulfilled, (state, action) => { state.isLoading = false; state.list = action.payload; })
      .addCase(fetchServices.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      .addCase(createService.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s._id !== action.meta.arg);
      });
  },
});

export default servicesSlice.reducer;