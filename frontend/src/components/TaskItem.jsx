import React, { useState, useRef, useEffect } from 'react';
import mojs from 'mo-js';
import * as api from '../services/api';
import './TaskItem.css';
import TaskDetails from './TaskDetails';

const TaskItem = ({ task, index, onTaskUpdate, onTaskDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const checkboxRef = useRef(null);
  const burstAnimation = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      burstAnimation.current = new mojs.Burst({
        parent: checkboxRef.current,
        radius: { 20: 50 },
        count: 10,
        duration: 800,
        children: {
          shape: 'circle',
          fill: ['#339af0', '#fab005', '#f06595', '#51cf66'],
          radius: 'rand(3, 6)',
          degree: 360,
          isForce3d: true,
        },
      });
    }
  }, []);

  const handleToggleComplete = async () => {
    // Only play animation when completing, not un-completing
    if (!task.completed) {
      burstAnimation.current?.play();
    }

    try {
      const updatedTask = await api.updateTask(task.id, { completed: !task.completed });
      onTaskUpdate(updatedTask.data);
    } catch (error) {
      console.error("Failed to update task", error);
      // Optionally show an error to the user
    }
  };

  const handleDelete = () => {
    if (window.confirm(`你确定要删除任务 "${task.title}" 吗？`)) {
      setIsExiting(true);
      // Wait for animation to finish before removing from state
      setTimeout(() => {
        onTaskDelete(task.id);
      }, 300); // Must match animation duration
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const priorityClass = `priority-${task.priority?.toLowerCase()}`;

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${isExiting ? 'exiting' : ''} ${isExpanded ? 'is-expanded' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="task-item-main" onClick={handleToggleExpand}>
        <div className="task-item-checkbox-wrapper" ref={checkboxRef}>
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
        <button className="delete-task-button" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>×</button>
        <div className="task-item-expand-icon">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      <div className="task-details-wrapper">
        <div>
          {isExpanded && <TaskDetails task={task} onTaskUpdate={onTaskUpdate} />}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
