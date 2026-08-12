// admin-panel/src/redux/slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/adminService';

export const fetchProjects = createAsyncThunk('projects/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getProjects();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    return await createProject(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const editProject = createAsyncThunk('projects/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateProject(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const removeProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    return await deleteProject(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p._id === action.payload._id);   // ✅ _id
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p._id !== action.meta.arg);          // ✅ _id
      });
  },
});

export default projectsSlice.reducer;