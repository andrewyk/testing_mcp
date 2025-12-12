import { useTodoStore } from '../store/todoStore';
import { Card } from './Card';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaCalendarDay, 
  FaCalendarWeek 
} from 'react-icons/fa';

export const StatsBar = () => {
  const { stats } = useTodoStore();

  const statItems = [
    {
      label: 'Total',
      value: stats.total || 0,
      icon: FaTasks,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active',
      value: stats.active || 0,
      icon: FaExclamationCircle,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Completed',
      value: stats.completed || 0,
      icon: FaCheckCircle,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Today',
      value: stats.today || 0,
      icon: FaCalendarDay,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'This Week',
      value: stats.thisWeek || 0,
      icon: FaCalendarWeek,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Overdue',
      value: stats.overdue || 0,
      icon: FaExclamationCircle,
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
