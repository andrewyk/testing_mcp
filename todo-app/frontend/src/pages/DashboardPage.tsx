import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { taskService, projectService, tagService } from '../services/api';
import { Plus, CheckSquare, LogOut, Filter, Search } from 'lucide-react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Sidebar from '../components/Sidebar';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filterStatus, filterPriority, searchQuery],
    queryFn: () =>
      taskService.getTasks({
        ...(filterStatus && { status: filterStatus }),
        ...(filterPriority && { priority: filterPriority }),
        ...(searchQuery && { search: searchQuery }),
      }),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
  });

  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowTaskForm(false);
    },
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        projects={projects}
        tags={tags}
        onFilterChange={(filters) => {
          setFilterStatus(filters.status || '');
          setFilterPriority(filters.priority || '');
        }}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CheckSquare className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Todo App</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">My Tasks</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                onClick={() => setShowTaskForm(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="card p-12 text-center">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first task to get started
                </p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn btn-primary"
                >
                  Create Task
                </button>
              </div>
            ) : (
              <TaskList tasks={tasks} projects={projects} tags={tags} />
            )}
          </div>
        </main>
      </div>

      {showTaskForm && (
        <TaskForm
          projects={projects}
          tags={tags}
          onSubmit={(data) => createTaskMutation.mutate(data)}
          onClose={() => setShowTaskForm(false)}
          isLoading={createTaskMutation.isPending}
        />
      )}
    </div>
  );
}
