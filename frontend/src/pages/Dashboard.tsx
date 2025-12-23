import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Task, Project } from '../types';
import api from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        api.getTasks(),
        api.getProjects(),
      ]);
      setTasks(tasksRes.data.data.tasks || []);
      setProjects(projectsRes.data.data.projects || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const response = await api.createTask(taskData);
      setTasks([...tasks, response.data.data.task]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await api.updateTask(id, taskData);
      setTasks(tasks.map((t) => (t.id === id ? response.data.data.task : t)));
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const response = await api.toggleTaskComplete(id);
      setTasks(tasks.map((t) => (t.id === id ? response.data.data.task : t)));
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by project
    if (selectedProject) {
      filtered = filtered.filter((t) => t.projectId === selectedProject);
    }

    // Filter by status
    switch (filter) {
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter((t) => t.dueDate?.startsWith(today));
        break;
      case 'upcoming':
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        filtered = filtered.filter((t) => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return dueDate <= nextWeek && !t.completed;
        });
        break;
      case 'completed':
        filtered = filtered.filter((t) => t.completed);
        break;
      case 'active':
        filtered = filtered.filter((t) => !t.completed);
        break;
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="main-content">
        <Header
          user={user}
          onNewTask={() => setShowTaskForm(true)}
        />

        <div className="content-area">
          {showTaskForm && (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
              projects={projects}
            />
          )}

          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
              projects={projects}
            />
          )}

          <TaskList
            tasks={getFilteredTasks()}
            onToggleComplete={handleToggleComplete}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
