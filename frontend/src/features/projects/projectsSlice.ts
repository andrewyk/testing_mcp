import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  ownerId: number;
  ownerUsername?: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

const getAuthHeader = (getState: any) => {
  const state = getState();
  return { Authorization: `Bearer ${state.auth.token}` };
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`, {
        headers: getAuthHeader(getState),
      });
      return response.data.projects;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch projects');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (projectId: number, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: getAuthHeader(getState),
      });
      return response.data.project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: Partial<Project>, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData, {
        headers: getAuthHeader(getState),
      });
      return response.data.project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }: { id: number; data: Partial<Project> }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, data, {
        headers: getAuthHeader(getState),
      });
      return response.data.project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: number, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: getAuthHeader(getState),
      });
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete project');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject(state) {
      state.currentProject = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Project
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
      })
      .addCase(updateProject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
