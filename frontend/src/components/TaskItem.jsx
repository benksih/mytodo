import React, { useState } from 'react';
import * as api from '../services/api';
import './TaskItem.css';
import TaskDetails from './TaskDetails';

const TaskItem = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = async () => {
    try {
      const updatedTask = await api.updateTask(task.id, { completed: !task.completed });
      onTaskUpdate(updatedTask.data);
    } catch (error) {
      console.error("Failed to update task", error);
      // Optionally show an error to the user
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const priorityClass = `priority-${task.priority?.toLowerCase()}`;

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-item-main" onClick={handleToggleExpand}>
        <div className="task-item-checkbox-wrapper">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking checkbox
          />
        </div>
        <div className="task-item-title">
          <p>{task.title}</p>
        </div>
        <div className="task-item-meta">
          {task.priority && <span className={`task-priority ${priorityClass}`}>{task.priority}</span>}
          {task.dueDate && <span className="task-due-date">{new Date(task.dueDate).toLocaleDateString()}</span>}
        </div>
        <div className="task-item-expand-icon">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      {isExpanded && <TaskDetails task={task} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />}
    </div>
  );
};

export default TaskItem;
