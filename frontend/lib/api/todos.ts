import apiClient from './client';
import { Todo, PaginationInfo, Category, Tag } from '../types';

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'active' | 'completed' | 'archived';
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateTodoData extends Partial<CreateTodoData> {}

export interface TodoFilters {
  status?: string;
  priority?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const todoApi = {
  create: async (data: CreateTodoData): Promise<{ todo: Todo }> => {
    const response = await apiClient.post<{ todo: Todo }>('/todos', data);
    return response.data;
  },

  getAll: async (filters?: TodoFilters): Promise<{ todos: Todo[]; pagination: PaginationInfo }> => {
    const response = await apiClient.get<{ todos: Todo[]; pagination: PaginationInfo }>('/todos', {
      params: filters,
    });
    return response.data;
  },

  getOne: async (id: string): Promise<{ todo: Todo }> => {
    const response = await apiClient.get<{ todo: Todo }>(`/todos/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateTodoData): Promise<{ todo: Todo }> => {
    const response = await apiClient.put<{ todo: Todo }>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/todos/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: string[]): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post<{ message: string; count: number }>('/todos/bulk-delete', { ids });
    return response.data;
  },

  bulkUpdate: async (ids: string[], updates: UpdateTodoData): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post<{ message: string; count: number }>('/todos/bulk-update', { ids, updates });
    return response.data;
  },
};

export const categoryApi = {
  create: async (data: { name: string; color?: string }): Promise<{ category: Category }> => {
    const response = await apiClient.post<{ category: Category }>('/categories', data);
    return response.data;
  },

  getAll: async (): Promise<{ categories: Category[] }> => {
    const response = await apiClient.get<{ categories: Category[] }>('/categories');
    return response.data;
  },

  update: async (id: string, data: { name: string; color?: string }): Promise<{ category: Category }> => {
    const response = await apiClient.put<{ category: Category }>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  },
};

export const tagApi = {
  create: async (data: { name: string; color?: string }): Promise<{ tag: Tag }> => {
    const response = await apiClient.post<{ tag: Tag }>('/tags', data);
    return response.data;
  },

  getAll: async (): Promise<{ tags: Tag[] }> => {
    const response = await apiClient.get<{ tags: Tag[] }>('/tags');
    return response.data;
  },

  update: async (id: string, data: { name: string; color?: string }): Promise<{ tag: Tag }> => {
    const response = await apiClient.put<{ tag: Tag }>(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/tags/${id}`);
    return response.data;
  },
};
