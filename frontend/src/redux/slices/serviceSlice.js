

// frontend/src/redux/slices/serviceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import serviceService from '../../services/serviceService'

export const fetchServices = createAsyncThunk(
  'services/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await serviceService.getServices()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    list: [],
    isLoading: false,
    error: null, // ← added error field
  },
  // reducers: {
  //   clearServicesError: (state) => {
  //     state.error = null
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch services'
      })
  },
})

// export const { clearServicesError } = serviceSlice.actions

// Selectors
export const selectAllServices = (state) => state.services.list
export const selectServicesLoading = (state) => state.services.isLoading
export const selectServicesError = (state) => state.services.error

export default serviceSlice.reducer