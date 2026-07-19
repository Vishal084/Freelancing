import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder as deleteOrderAPI   // ← alias to avoid conflict
} from '../../Services/adminService';

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', getAllOrders);
export const changeOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  ({ id, status }) => updateOrderStatus(id, status)
);
export const deleteOrder = createAsyncThunk(
  'orders/delete',
  (id) => deleteOrderAPI(id)       // ← use the aliased function
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.list = state.list.filter(o => o._id !== action.meta.arg);
      });
  },
});

export default ordersSlice.reducer;