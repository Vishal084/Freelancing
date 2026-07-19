import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminService from '../../Services/adminService';

export const fetchServices = createAsyncThunk('services/fetch', () => adminService.getServices()); // public route /services
export const createService = createAsyncThunk('services/create', (data) => adminService.createService(data));
export const updateService = createAsyncThunk('services/update', ({ id, data }) => adminService.updateService(id, data));
export const deleteService = createAsyncThunk('services/delete', (id) => adminService.deleteService(id));

const servicesSlice = createSlice({
  name: 'services',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(createService.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s.id !== action.meta.arg);
      });
  }
});
export default servicesSlice.reducer;