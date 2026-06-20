



// uncommented latter : 
// frontend/src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '../../services/orderService'

/**
 * Thunk: Create a new order.
 * Sends order data to the API (JWT required).
 */
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.placeOrder(orderData)
    } catch (error) {
      // Extract error message from API response if available
      const message =
        error.response?.data?.message || error.message || 'Order creation failed'
      return rejectWithValue(message)
    }
  }
)

/**
 * Thunk: Fetch orders for the authenticated user.
 * No longer needs a userId – the backend identifies the user from the JWT.
 */
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  async (_, { rejectWithValue }) => {   // ← no arguments
    try {
      return await orderService.getUserOrders()
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch orders'
      return rejectWithValue(message)
    }
  }
)

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
      state.lastOrder = null
    },
    clearOrdersError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ── CREATE ORDER ────────────────────────────
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.lastOrder = action.payload
        // Avoid duplicate (use _id from MongoDB)
        if (!state.userOrders.find(o => o._id === action.payload._id)) {
          state.userOrders.unshift(action.payload) // newest first
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // ── FETCH USER ORDERS ──────────────────────
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.userOrders = action.payload
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearLastOrder, clearOrdersError } = orderSlice.actions

// Selectors (encapsulate state shape)
export const selectUserOrders = (state) => state.orders.userOrders
export const selectLastOrder = (state) => state.orders.lastOrder
export const selectOrdersLoading = (state) => state.orders.isLoading
export const selectOrdersError = (state) => state.orders.error

export default orderSlice.reducer