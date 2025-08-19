import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import * as api from './services/api';
import './App.css';

// --- Auth Context ---
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.login({ email, password });
      setToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      alert('登录失败！');
    }
  };

  const register = async (email, password) => {
    try {
      await api.register({ email, password });
      alert('注册成功！请登录。');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      alert('注册失败！');
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  const value = { token, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// --- Pages and Components ---

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>登录</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="邮箱" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" required />
          <button type="submit">登录</button>
        </form>
      </div>
    );
};

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        register(email, password);
    };
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>注册</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="邮箱" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" required />
          <button type="submit">注册</button>
        </form>
      </div>
    );
};

const DashboardPage = () => {
    const { logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    // Add other fields as needed, e.g., dueDate, points

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await api.getTasks();
                setTasks(data);
            } catch (error) {
                console.error("获取任务失败", error);
            }
        };
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            // Simplified task creation
            const newTask = { title, dueDate: new Date(), reminderTime: new Date(), points: 10 };
            const { data } = await api.createTask(newTask);
            setTasks([...tasks, data]);
            setTitle('');
        } catch (error) {
            console.error("创建任务失败", error);
        }
    };

    return (
        <div className="container">
            <h2>仪表盘</h2>
            <button onClick={logout}>退出登录</button>
            <form onSubmit={handleAddTask}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="新任务标题" />
                <button type="submit">添加任务</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title} - {task.completed ? "已完成" : "待处理"}</li>
                ))}
            </ul>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};


// --- App Structure ---

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

// The main export needs to include the Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
