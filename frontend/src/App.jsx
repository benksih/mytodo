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
      alert('Login failed!');
    }
  };

  const register = async (email, password) => {
    try {
      await api.register({ email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed!');
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
          <h2>Login</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
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
          <h2>Register</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Register</button>
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
                console.error("Failed to fetch tasks", error);
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
            console.error("Failed to create task", error);
        }
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <button onClick={logout}>Logout</button>
            <form onSubmit={handleAddTask}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Task Title" />
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title} - {task.completed ? "Completed" : "Pending"}</li>
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
