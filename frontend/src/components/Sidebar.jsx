import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  // Placeholder data - we will fetch real data later
  const categories = [{id: 1, name: '工作'}, {id: 2, name: '生活'}];
  const user = { email: 'user@example.com', totalScore: 1250 };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Todo App</h3>
      </div>
      <div className="user-profile">
        <div className="user-avatar"></div>
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          <span className="user-score">积分: {user.totalScore}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active"><a>所有任务</a></li>
          {categories.map(category => (
            <li key={category.id} className="nav-item">
              <a>{category.name}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="sidebar-action-button">
          {theme === 'light' ? '🌙' : '☀️'} 切换主题
        </button>
        <button onClick={logout} className="sidebar-action-button">退出登录</button>
      </div>
    </aside>
  );
};

export default Sidebar;
