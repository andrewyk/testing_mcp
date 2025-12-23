import api from './api';
import { Task, CreateTaskData, UpdateTaskData } from '../types';

export const taskService = {
  async getTasks(params?: Record<string, any>) {
    const response = await api.get('/tasks', { params });
    return response.data.tasks as Task[];
  },

  async getTask(id: string) {
    const response = await api.get(`/tasks/${id}`);
    return response.data.task as Task;
  },

  async createTask(data: CreateTaskData) {
    const response = await api.post('/tasks', data);
    return response.data.task as Task;
  },

  async updateTask(id: string, data: UpdateTaskData) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.task as Task;
  },

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
  },
};
