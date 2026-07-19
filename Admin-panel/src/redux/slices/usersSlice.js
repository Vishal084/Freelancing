import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, deleteUser, toggleBan, toggleAdmin } from '../../services/adminService';

export const fetchUsers = createAsyncThunk('users/fetch', getUsers);
export const removeUser = createAsyncThunk('users/delete', (id) => deleteUser(id));
export const banUser = createAsyncThunk('users/toggleBan', (id) => toggleBan(id));
export const adminUser = createAsyncThunk('users/toggleAdmin', (id) => toggleAdmin(id));

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u._id !== action.meta.arg);
      })
      .addCase(banUser.fulfilled, (state, action) => {
        const idx = state.list.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(adminUser.fulfilled, (state, action) => {
        const idx = state.list.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default usersSlice.reducer;