// admin-panel/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, getMe } from '../../services/adminService';   // ✅ correct path

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await login(credentials);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await getMe();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('adminUser')),
    token: localStorage.getItem('adminToken'),   // ✅ changed to adminToken
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {    // ✅ new reducer
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('adminToken', action.payload.token);
        localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        // ✅ token invalid or expired → force logout
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;