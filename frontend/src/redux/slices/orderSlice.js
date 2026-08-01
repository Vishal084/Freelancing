// frontend/src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// ──────────────────────────────
// Order status constants
// (Optionally move to utils/constants.js if you prefer)
// ──────────────────────────────
export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REVISION: 'revision',
};

export const ORDER_STATUS_COLORS = {
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
  revision: '#8b5cf6',
};

// ──────────────────────────────
// Thunks
// ──────────────────────────────

/**
 * Create a new order.
 */
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.placeOrder(orderData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Order creation failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch all orders for the authenticated user.
 */
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getUserOrders();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

/**
 * Cancel an existing order by ID.
 */
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderService.cancelOrder(orderId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to cancel order';
      return rejectWithValue(message);
    }
  }
);

// ──────────────────────────────
// Slice
// ──────────────────────────────
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: [],
    isLoading: false,
    lastOrder: null,
    error: null,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
    clearOrdersError: (state) => {
      state.error = null;
    },
    // Optional: manual status update for real‑time or offline scenarios
    updateOrderStatusLocally: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.userOrders.find((o) => o._id === orderId);
      if (order) {
        order.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── CREATE ORDER ────────────────────────────
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastOrder = action.payload;
        // Avoid duplicate (uses _id from MongoDB)
        if (!state.userOrders.find((o) => o._id === action.payload._id)) {
          state.userOrders.unshift(action.payload); // newest first
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ── FETCH USER ORDERS ──────────────────────
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ── CANCEL ORDER ────────────────────────────
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        // API returns the updated order with status 'cancelled'
        const cancelledOrder = action.payload;
        const index = state.userOrders.findIndex(
          (o) => o._id === cancelledOrder._id
        );
        if (index !== -1) {
          state.userOrders[index] = cancelledOrder;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLastOrder, clearOrdersError, updateOrderStatusLocally } =
  orderSlice.actions;

// Selectors
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectLastOrder = (state) => state.orders.lastOrder;
export const selectOrdersLoading = (state) => state.orders.isLoading;
export const selectOrdersError = (state) => state.orders.error;

export default orderSlice.reducer;