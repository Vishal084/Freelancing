// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'
import api from '../../services/api' // shared axios instance

// ------------------------------------------------------------------
// Security note:
// JWTs stored in localStorage are vulnerable to XSS.
// In a high‑security production app, consider using
// httpOnly cookies + CSRF tokens instead.
// ------------------------------------------------------------------

// Helper: check if a JWT is expired (or missing)
// (You can move this to utils/helpers.js and import it)
const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Constants for localStorage keys (avoid typos)
const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
}

// Helper to safely load user from localStorage on app init
const loadUserFromStorage = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER)
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

  // If missing or expired – wipe and return null
  if (!userJson || !token || isTokenExpired(token)) {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    return null
  }

  try {
    return JSON.parse(userJson)
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    return null
  }
}

// ── Async Thunks ──────────────────────────────────────────────

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

// Verify token validity on app start
// NO manual localStorage cleanup here – the 401 interceptor handles that
export const verifyToken = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      // Let the interceptor handle 401 – just return the error
      return rejectWithValue(error.response?.data?.message || 'Session expired')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────

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
        // token remains unchanged (already in storage)
      })
      .addCase(verifyToken.rejected, (state, action) => {
        // Do NOT clear user or storage here!
        // - 401 → interceptor already dispatched 'logout' and cleared everything
        // - network error → we still have a valid token, keep the user logged in
        // Just set an error message so the UI can decide if needed.
        state.error = action.payload || 'Failed to verify session'
      })
  },
})

export const { logout, clearUser, clearError } = authSlice.actions

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => !!state.auth.user
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer