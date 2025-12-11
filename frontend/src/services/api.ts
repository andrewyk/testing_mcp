import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/auth/register', data);
  }

  async login(data: { email: string; password: string }): Promise<AxiosResponse> {
    return this.api.post('/auth/login', data);
  }

  async getProfile(): Promise<AxiosResponse> {
    return this.api.get('/auth/profile');
  }

  // Task endpoints
  async getTasks(params?: Record<string, any>): Promise<AxiosResponse> {
    return this.api.get('/tasks', { params });
  }

  async getTask(id: string): Promise<AxiosResponse> {
    return this.api.get(`/tasks/${id}`);
  }

  async createTask(data: Partial<any>): Promise<AxiosResponse> {
    return this.api.post('/tasks', data);
  }

  async updateTask(id: string, data: Partial<any>): Promise<AxiosResponse> {
    return this.api.put(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<AxiosResponse> {
    return this.api.delete(`/tasks/${id}`);
  }

  async toggleTaskComplete(id: string): Promise<AxiosResponse> {
    return this.api.patch(`/tasks/${id}/toggle`);
  }

  // Project endpoints
  async getProjects(params?: Record<string, any>): Promise<AxiosResponse> {
    return this.api.get('/projects', { params });
  }

  async getProject(id: string): Promise<AxiosResponse> {
    return this.api.get(`/projects/${id}`);
  }

  async createProject(data: Partial<any>): Promise<AxiosResponse> {
    return this.api.post('/projects', data);
  }

  async updateProject(id: string, data: Partial<any>): Promise<AxiosResponse> {
    return this.api.put(`/projects/${id}`, data);
  }

  async deleteProject(id: string): Promise<AxiosResponse> {
    return this.api.delete(`/projects/${id}`);
  }
}

export default new ApiService();
