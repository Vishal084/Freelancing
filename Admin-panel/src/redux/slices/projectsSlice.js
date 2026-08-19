// admin-panel/src/redux/slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../services/adminService';

export const fetchProjects = createAsyncThunk(
  'projects/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProjects();
      // Normalise response: array stays, object with `projects` gets extracted
      return Array.isArray(res) ? res : res.projects || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addProject = createAsyncThunk(
  'projects/create',
  async (data, { rejectWithValue }) => {
    try {
      return await createProject(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateProject(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteProject(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(addProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(removeProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.meta.arg);
      });
  },
});

export default projectsSlice.reducer;