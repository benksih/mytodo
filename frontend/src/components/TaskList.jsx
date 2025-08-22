import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  if (tasks.length === 0) {
    return <div className="empty-state">还没有任何任务，快来添加一个吧！</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
