// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'
import api from '../../services/api' // <-- import the shared axios instance

// Constants for localStorage keys (avoid typos)
const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
}

// Helper to load user from localStorage on app init
const loadUserFromStorage = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER)
  return userJson ? JSON.parse(userJson) : null
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response // { user, token }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// 🔁 New: verify token validity on app start
export const verifyToken = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      // Token invalid or expired → force logout
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      return rejectWithValue('Session expired')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUserFromStorage(),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      state.user = null
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user))
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Login failed'
      })
      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user))
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token)
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Signup failed'
      })
      // VERIFY TOKEN
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload))
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
      })
  },
})

export const { logout, clearUser, clearError } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => !!state.auth.user
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer