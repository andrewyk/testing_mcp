import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import { taskService } from '../services/task.service';
import { useTaskStore } from '../store/taskStore';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [view, setView] = useState<'all' | 'today' | 'upcoming'>('all');
  const { setTasks, setLoading } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, [view]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (view === 'today') {
        params.dueDate = 'today';
      }
      const tasks = await taskService.getTasks(params);
      setTasks(tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar view={view} onViewChange={setView} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<TaskList view={view} onRefresh={loadTasks} />} />
          <Route path="/today" element={<TaskList view="today" onRefresh={loadTasks} />} />
          <Route path="/upcoming" element={<TaskList view="upcoming" onRefresh={loadTasks} />} />
        </Routes>
      </main>
    </div>
  );
}
