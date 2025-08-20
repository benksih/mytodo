import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import TaskList from '../components/TaskList';
import './DashboardPage.css';

const DashboardPage = () => {
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
        if (!title.trim()) return;
        try {
            // Simplified task creation
            const newTask = { title, points: 10, priority: 'Medium' }; // Default priority
            const { data } = await api.createTask(newTask);
            setTasks([data, ...tasks]); // Add to the top of the list
            setTitle('');
        } catch (error) {
            console.error("创建任务失败", error);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleTaskDelete = (deletedTaskId) => {
        setTasks(tasks.filter(t => t.id !== deletedTaskId));
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>我的任务</h1>
                <form onSubmit={handleAddTask} className="add-task-form">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="添加一个新任务..."
                    />
                    <button type="submit">+</button>
                </form>
            </header>
            <TaskList
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
            />
        </div>
    );
};

export default DashboardPage;
