import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({});
  const [view, setView] = useState('all');

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        taskService.getTasks(filters),
        projectService.getProjects(),
      ]);
      setTasks(tasksData.data);
      setProjects(projectsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      setShowTaskForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await taskService.deleteTask(id);
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await taskService.toggleComplete(id);
      loadData();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    // Apply filters based on view
    switch (newView) {
      case 'today':
        setFilters({ dueDate: new Date().toISOString().split('T')[0] });
        break;
      case 'high-priority':
        setFilters({ priority: 'high' });
        break;
      case 'completed':
        setFilters({ status: 'completed' });
        break;
      default:
        setFilters({});
    }
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    if (view === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.dueDate && task.dueDate.startsWith(today));
    } else if (view === 'upcoming') {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      });
    }
    
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onNewTask={() => setShowTaskForm(true)} />
      <div className="flex">
        <Sidebar
          view={view}
          onViewChange={handleViewChange}
          projects={projects}
          taskCount={tasks.length}
        />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <TaskList
              tasks={getFilteredTasks()}
              loading={loading}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </main>
      </div>

      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          projects={projects}
          onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
