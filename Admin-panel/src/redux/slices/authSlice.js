import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, getMe } from '../../services/adminService';

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try { return await login(credentials); } catch (err) { return rejectWithValue(err.response.data.message); }
});
export const fetchMe = createAsyncThunk('auth/me', async () => {
  return await getMe();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: JSON.parse(localStorage.getItem('adminUser')), token: localStorage.getItem('token'), isLoading: false, error: null },
  reducers: { logout: (state) => { localStorage.removeItem('token'); localStorage.removeItem('adminUser'); state.user = null; state.token = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false; state.user = action.payload.user; state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token); localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
      })
      .addCase(loginAdmin.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; })
  }
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;