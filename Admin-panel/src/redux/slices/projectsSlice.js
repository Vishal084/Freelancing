import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjects, createProject, updateProject, deleteProject } from '../../Services/adminService';

export const fetchProjects = createAsyncThunk('projects/fetch', getProjects);
export const addProject = createAsyncThunk('projects/create', (data) => createProject(data));
export const editProject = createAsyncThunk('projects/update', ({ id, data }) => updateProject(id, data));
export const removeProject = createAsyncThunk('projects/delete', (id) => deleteProject(id));

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
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.meta.arg);
      });
  },
});

export default projectsSlice.reducer;