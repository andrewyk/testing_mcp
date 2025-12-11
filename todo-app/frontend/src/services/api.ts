import axios from 'axios';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  Project,
  CreateProjectInput,
  Tag,
  CreateTagInput,
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};

export const taskService = {
  async getTasks(params?: Record<string, any>): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  async getProject(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectInput): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async updateProject(id: number, data: Partial<CreateProjectInput>): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

export const tagService = {
  async getTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  async createTag(data: CreateTagInput): Promise<Tag> {
    const response = await api.post<Tag>('/tags', data);
    return response.data;
  },

  async updateTag(id: number, data: Partial<CreateTagInput>): Promise<Tag> {
    const response = await api.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  async deleteTag(id: number): Promise<void> {
    await api.delete(`/tags/${id}`);
  },
};

export default api;
