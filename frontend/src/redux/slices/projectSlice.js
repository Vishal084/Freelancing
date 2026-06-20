



// frontend/src/redux/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import projectService from '../../services/projectService'

export const fetchProjects = createAsyncThunk(
  'projects/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await projectService.getProjects()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  // reducers: {
  //   clearProjectsError: (state) => {
  //     state.error = null
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch projects'
      })
  },
})

// export const { clearProjectsError } = projectSlice.actions

// Selectors
export const selectAllProjects = (state) => state.projects.list
export const selectProjectsLoading = (state) => state.projects.isLoading
export const selectProjectsError = (state) => state.projects.error

export default projectSlice.reducer