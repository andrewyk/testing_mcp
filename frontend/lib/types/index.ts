export interface User {
  id: string;
  email: string;
  name?: string;
  settings?: any;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  notes?: string;
  recurrence?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  category?: Category;
  categoryId?: string;
  tags: TodoTag[];
  subtasks: Subtask[];
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface TodoTag {
  todoId: string;
  tagId: string;
  tag: Tag;
}

export interface Subtask {
  id: string;
  todoId: string;
  title: string;
  status: 'active' | 'completed';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
