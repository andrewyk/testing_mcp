import { create } from 'zustand';
import api from '../services/api';

export const useTodoStore = create((set, get) => ({
  todos: [],
  projects: [],
  tags: [],
  stats: {},
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: null,
    project_id: null,
    search: '',
  },
  sortBy: 'created_at',
  sortOrder: 'desc',

  // Fetch todos
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, sortBy, sortOrder } = get();
      const params = { ...filters, sort: sortBy, order: sortOrder };
      const response = await api.get('/todos', { params });
      set({ todos: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch todos', loading: false });
    }
  },

  // Create todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      set((state) => ({ todos: [response.data, ...state.todos] }));
      get().fetchStats();
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create todo' });
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? response.data : todo)),
      }));
      get().fetchStats();
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update todo' });
      throw error;
    }
  },

  // Delete todo
  deleteTodo: async (id, permanent = false) => {
    try {
      await api.delete(`/todos/${id}`, { params: { permanent } });
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
      get().fetchStats();
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete todo' });
      throw error;
    }
  },

  // Toggle todo completion
  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (todo) {
      await get().updateTodo(id, { completed: !todo.completed });
    }
  },

  // Fetch projects
  fetchProjects: async () => {
    try {
      const response = await api.get('/projects');
      set({ projects: response.data });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  },

  // Create project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      set((state) => ({ projects: [...state.projects, response.data] }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      set((state) => ({
        projects: state.projects.map((project) => 
          project.id === id ? response.data : project
        ),
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Fetch tags
  fetchTags: async () => {
    try {
      const response = await api.get('/tags');
      set({ tags: response.data });
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  },

  // Create tag
  createTag: async (tagData) => {
    try {
      const response = await api.post('/tags', tagData);
      set((state) => ({ tags: [...state.tags, response.data] }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete tag
  deleteTag: async (id) => {
    try {
      await api.delete(`/tags/${id}`);
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await api.get('/todos/stats');
      set({ stats: response.data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  // Update filters
  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().fetchTodos();
  },

  // Update sort
  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
    get().fetchTodos();
  },
}));
