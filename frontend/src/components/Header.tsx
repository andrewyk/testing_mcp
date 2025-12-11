import React from 'react';
import type { User } from '../types';
import { useAuth } from '../context/AuthContext';
import './Header.css';

interface HeaderProps {
  user: User | null;
  onNewTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNewTask }) => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">📝 Todo App</h1>

        <div className="header-actions">
          <button className="btn-new-task" onClick={onNewTask}>
            + New Task
          </button>

          <div className="user-menu">
            <span className="user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
