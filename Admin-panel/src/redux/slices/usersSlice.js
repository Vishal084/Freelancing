import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, deleteUser, toggleBan, toggleAdmin } from '../../services/adminService';

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUsers();
      return res.users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteUser(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const banUser = createAsyncThunk(
  'users/toggleBan',
  async (id, { rejectWithValue }) => {
    try {
      return await toggleBan(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const adminUser = createAsyncThunk(
  'users/toggleAdmin',
  async (id, { rejectWithValue }) => {
    try {
      return await toggleAdmin(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete user
      .addCase(removeUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter(u => u._id !== action.meta.arg);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Toggle ban
      .addCase(banUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.list.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(banUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Toggle admin
      .addCase(adminUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.list.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(adminUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;