export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  user_id: number;
  parent_id?: number;
  archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'none' | 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'waiting' | 'blocked' | 'completed';
  due_date?: Date;
  completed_at?: Date;
  estimated_time?: number;
  actual_time?: number;
  project_id?: number;
  user_id: number;
  assigned_to?: number;
  parent_task_id?: number;
  is_recurring: boolean;
  recurrence_pattern?: any;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: Date;
}

export interface Comment {
  id: number;
  content: string;
  task_id: number;
  user_id: number;
  parent_comment_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Attachment {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  task_id?: number;
  comment_id?: number;
  user_id: number;
  created_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
    username: string;
  };
}
